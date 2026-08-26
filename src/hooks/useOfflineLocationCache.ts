import { useCallback, useRef, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

/**
 * Offline Location Cache
 *
 * Uses IndexedDB to queue location updates when offline.
 * Automatically syncs queued entries when connectivity returns.
 * Implements data minimization with configurable TTL purge.
 *
 * Privacy features:
 *  - Entries auto-expire after TTL (default: 24h)
 *  - Queue size is capped (default: 200 entries)
 *  - Only essential fields are stored
 */

const DB_NAME = "sukoon_offline_cache";
const STORE_NAME = "location_queue";
const DB_VERSION = 1;
const MAX_QUEUE_SIZE = 200;
const DEFAULT_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

interface QueuedLocation {
  id: string;
  latitude: number;
  longitude: number;
  accuracy: number;
  source: string;
  stage: string | null;
  groupId: string;
  memberId: string;
  timestamp: number;
  expiresAt: number;
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: "id" });
        store.createIndex("timestamp", "timestamp", { unique: false });
        store.createIndex("expiresAt", "expiresAt", { unique: false });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export function useOfflineLocationCache(ttlMs: number = DEFAULT_TTL_MS) {
  const [queueSize, setQueueSize] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);
  const syncingRef = useRef(false);

  // Purge expired entries
  const purgeExpired = useCallback(async () => {
    try {
      const db = await openDB();
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      const index = store.index("expiresAt");
      const now = Date.now();

      const range = IDBKeyRange.upperBound(now);
      const request = index.openCursor(range);

      request.onsuccess = () => {
        const cursor = request.result;
        if (cursor) {
          cursor.delete();
          cursor.continue();
        }
      };

      await new Promise<void>((resolve) => {
        tx.oncomplete = () => resolve();
      });
    } catch {
      // IndexedDB not available
    }
  }, []);

  // Enqueue a location for offline sync
  const enqueue = useCallback(
    async (entry: Omit<QueuedLocation, "id" | "expiresAt">) => {
      try {
        const db = await openDB();
        const tx = db.transaction(STORE_NAME, "readwrite");
        const store = tx.objectStore(STORE_NAME);

        // Cap queue size (FIFO: remove oldest)
        const countReq = store.count();
        await new Promise<void>((resolve) => {
          countReq.onsuccess = () => {
            if (countReq.result >= MAX_QUEUE_SIZE) {
              const oldest = store.index("timestamp").openCursor();
              oldest.onsuccess = () => {
                if (oldest.result) oldest.result.delete();
                resolve();
              };
            } else {
              resolve();
            }
          };
        });

        const record: QueuedLocation = {
          ...entry,
          id: `${entry.timestamp}-${Math.random().toString(36).slice(2, 8)}`,
          expiresAt: entry.timestamp + ttlMs,
        };

        store.put(record);

        await new Promise<void>((resolve) => {
          tx.oncomplete = () => {
            setQueueSize((prev) => Math.min(prev + 1, MAX_QUEUE_SIZE));
            resolve();
          };
        });
      } catch {
        // Graceful degradation if IndexedDB unavailable
      }
    },
    [ttlMs]
  );

  // Sync queued entries to server
  const syncQueue = useCallback(async () => {
    if (syncingRef.current) return;
    syncingRef.current = true;
    setIsSyncing(true);

    try {
      await purgeExpired();

      const db = await openDB();
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const allReq = store.getAll();

      const entries = await new Promise<QueuedLocation[]>((resolve) => {
        allReq.onsuccess = () => resolve(allReq.result || []);
      });

      if (entries.length === 0) {
        setQueueSize(0);
        return;
      }

      // Batch upsert to member_locations (latest per member)
      const latestByMember = new Map<string, QueuedLocation>();
      for (const entry of entries) {
        const existing = latestByMember.get(entry.memberId);
        if (!existing || entry.timestamp > existing.timestamp) {
          latestByMember.set(entry.memberId, entry);
        }
      }

      for (const entry of latestByMember.values()) {
        await supabase.from("member_locations").upsert(
          {
            member_id: entry.memberId,
            group_id: entry.groupId,
            latitude: entry.latitude,
            longitude: entry.longitude,
            current_stage: entry.stage,
            pilgrim_status: "normal",
            updated_at: new Date(entry.timestamp).toISOString(),
          },
          { onConflict: "member_id,group_id" }
        );
      }

      // Clear synced entries
      const clearTx = db.transaction(STORE_NAME, "readwrite");
      clearTx.objectStore(STORE_NAME).clear();
      await new Promise<void>((resolve) => {
        clearTx.oncomplete = () => resolve();
      });

      setQueueSize(0);
    } catch (err) {
      console.warn("[OfflineCache] Sync failed, will retry:", err);
    } finally {
      syncingRef.current = false;
      setIsSyncing(false);
    }
  }, [purgeExpired]);

  // Auto-sync when coming back online
  useEffect(() => {
    const handleOnline = () => {
      syncQueue();
    };
    window.addEventListener("online", handleOnline);
    return () => window.removeEventListener("online", handleOnline);
  }, [syncQueue]);

  // Initial purge on mount
  useEffect(() => {
    purgeExpired();
  }, [purgeExpired]);

  return {
    enqueue,
    syncQueue,
    purgeExpired,
    queueSize,
    isSyncing,
    isOffline: typeof navigator !== "undefined" ? !navigator.onLine : false,
  };
}
