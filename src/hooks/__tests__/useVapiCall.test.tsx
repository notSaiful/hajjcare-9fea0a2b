import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { instances, MockVapi } = vi.hoisted(() => {
  type Listener = (payload?: unknown) => void;

  class MockVapi {
    static nextStartError: Error | null = null;
    handlers = new Map<string, Listener>();
    start = vi.fn(async () => {
      if (MockVapi.nextStartError) throw MockVapi.nextStartError;
      this.emit("call-start");
      return null;
    });
    stop = vi.fn(async () => undefined);
    removeAllListeners = vi.fn(() => this.handlers.clear());
    muted = false;

    constructor(_publicKey: string) {
      instances.push(this);
    }

    on(event: string, listener: Listener) {
      this.handlers.set(event, listener);
      return this;
    }

    emit(event: string, payload?: unknown) {
      this.handlers.get(event)?.(payload);
    }

    isMuted() {
      return this.muted;
    }

    setMuted(muted: boolean) {
      this.muted = muted;
    }
  }

  return { instances: [] as MockVapi[], MockVapi };
});

vi.mock("@vapi-ai/web", () => ({ default: MockVapi }));

import { useVapiCall } from "@/hooks/useVapiCall";

describe("useVapiCall", () => {
  beforeEach(() => {
    instances.length = 0;
    MockVapi.nextStartError = null;
  });

  it("starts a call and tears down its SDK instance when ended", async () => {
    const { result } = renderHook(() => useVapiCall());

    await act(async () => {
      await result.current.startCall("public-key", "assistant-id");
    });

    expect(result.current.status).toBe("active");
    expect(result.current.isListening).toBe(true);

    act(() => result.current.endCall());

    expect(result.current.status).toBe("ended");
    expect(instances[0].removeAllListeners).toHaveBeenCalledOnce();
    expect(instances[0].stop).toHaveBeenCalledOnce();
  });

  it("surfaces asynchronous start failures without leaving the UI connecting", async () => {
    MockVapi.nextStartError = new Error("network unavailable");
    const { result } = renderHook(() => useVapiCall());

    await act(async () => {
      await result.current.startCall("public-key", "assistant-id");
    });

    expect(result.current.status).toBe("error");
    expect(result.current.error).toBe("network unavailable");
  });

  it("replaces partial transcripts with their final message instead of repeating them", async () => {
    const { result } = renderHook(() => useVapiCall());

    await act(async () => {
      await result.current.startCall("public-key", "assistant-id");
    });

    act(() => {
      instances[0].emit("message", {
        type: "transcript",
        role: "user",
        transcript: "Where is",
        transcriptType: "partial",
      });
      instances[0].emit("message", {
        type: "transcript",
        role: "user",
        transcript: "Where is Mina?",
        transcriptType: "final",
      });
      instances[0].emit("message", {
        type: "transcript",
        role: "assistant",
        transcript: "Mina is east of Makkah.",
        transcriptType: "final",
      });
    });

    expect(result.current.transcript).toBe(
      "You: Where is Mina?\nHajjCare: Mina is east of Makkah."
    );
  });

  it("keeps a bounded transcript for long calls", async () => {
    const { result } = renderHook(() => useVapiCall());

    await act(async () => {
      await result.current.startCall("public-key", "assistant-id");
    });

    act(() => {
      for (let index = 0; index < 101; index += 1) {
        instances[0].emit("message", {
          type: "transcript",
          role: "assistant",
          transcript: `Guidance ${index}`,
          transcriptType: "final",
        });
      }
    });

    expect(result.current.transcript).not.toContain("Guidance 0");
    expect(result.current.transcript).toContain("Guidance 100");
    expect(result.current.transcript.split("\n")).toHaveLength(100);
  });
});
