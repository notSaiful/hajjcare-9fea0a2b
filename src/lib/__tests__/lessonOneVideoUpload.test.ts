import { describe, expect, it, vi } from "vitest";
import {
  LESSON_ONE_MAX_BYTES,
  LessonOneGateway,
  LessonOneRow,
  LessonOneUploadError,
  isLessonOneUploadedUrl,
  lessonOneObjectPath,
  lessonOneStoragePathFromUrl,
  messageFromStorageFailure,
  saveLessonOneVideo,
  selectLessonOneTarget,
  validateLessonOneFile,
  withLessonOneGuestFallback,
} from "@/lib/lessonOneVideoUpload";
import { createLessonOneGateway } from "@/lib/lessonOneSupabaseGateway";

const mp4 = (size: number, name = "hajcare-demo.mp4", type = "video/mp4") =>
  new File([new Uint8Array(Math.min(size, 8))], name, { type });

const row = (overrides: Partial<LessonOneRow> = {}): LessonOneRow => ({
  id: "lesson-1",
  course_id: "hajj-training",
  lesson_number: 1,
  language: "hi",
  external_url: null,
  published: false,
  platform: "youtube",
  ...overrides,
});

const gateway = (overrides: Partial<LessonOneGateway> = {}): LessonOneGateway => ({
  listLessonOne: vi.fn(async () => []),
  uploadFile: vi.fn(async (_path, _file, onProgress) => onProgress(40)),
  removeFile: vi.fn(async () => undefined),
  publicUrl: (path) => `https://begtqcmwruvwposocnsr.supabase.co/storage/v1/object/public/hajj-training-videos/${path}`,
  insertDraft: vi.fn(async () => "new-id"),
  updateVideoUrl: vi.fn(async () => undefined),
  ...overrides,
});

describe("Video 1 upload rules", () => {
  it("accepts a 27 MB mp4 and rejects other types and oversized files", () => {
    expect(validateLessonOneFile({ name: "demo.mp4", type: "video/mp4", size: 27 * 1024 * 1024 })).toBeNull();
    expect(validateLessonOneFile({ name: "demo.mp4", type: "", size: 1024 })).toBeNull();
    expect(validateLessonOneFile({ name: "demo.mov", type: "video/quicktime", size: 1024 })).toMatch(/MP4/);
    expect(validateLessonOneFile({ name: "demo.mp4", type: "video/webm", size: 1024 })).toMatch(/MP4/);
    expect(validateLessonOneFile({ name: "demo.mp4", type: "video/mp4", size: LESSON_ONE_MAX_BYTES + 1 })).toMatch(/40 MB/);
    expect(validateLessonOneFile({ name: "demo.mp4", type: "video/mp4", size: 0 })).toMatch(/40 MB/);
  });

  it("stores only under the lesson-1 prefix", () => {
    const path = lessonOneObjectPath("HajCare Demo.mp4", 10, "abc-123");
    expect(path).toBe("lesson-1/10-abc123-hajcare-demo.mp4");
    expect(() => lessonOneObjectPath("ok.mp4", 10, "abc")).not.toThrow();
  });

  it("recognises only Video 1 storage URLs", () => {
    const url = "https://begtqcmwruvwposocnsr.supabase.co/storage/v1/object/public/hajj-training-videos/lesson-1/10-abc-demo.mp4";
    expect(isLessonOneUploadedUrl(url)).toBe(true);
    expect(lessonOneStoragePathFromUrl(url)).toBe("lesson-1/10-abc-demo.mp4");
    expect(isLessonOneUploadedUrl("https://youtu.be/RgY_QHMGPCA")).toBe(false);
    expect(isLessonOneUploadedUrl("https://begtqcmwruvwposocnsr.supabase.co/storage/v1/object/public/hajj-training-videos/lesson-2/10-abc-demo.mp4")).toBe(false);
  });

  it("does not choose lesson 2, and stops when Video 1 is ambiguous", () => {
    expect(selectLessonOneTarget([row({ id: "other", lesson_number: 2 })]).row).toBeNull();
    expect(selectLessonOneTarget([row({ id: "keep" })]).row?.id).toBe("keep");
    const error = selectLessonOneTarget([
      row({ id: "a", language: "hi" }),
      row({ id: "b", language: "hi" }),
    ]).error;
    expect(error).toMatch(/nothing was changed/);
    expect(selectLessonOneTarget([
      row({ id: "en", language: "en", lesson_number: 1 }),
      row({ id: "hi", language: "hi", lesson_number: 1 }),
      row({ id: "later", lesson_number: 6 }),
    ]).row?.id).toBe("hi");
  });

  it("keeps the guest lesson until a published Video 1 exists", () => {
    const guest = [{ lesson_number: 1, external_url: "https://youtu.be/guest" }];
    expect(withLessonOneGuestFallback([], guest)).toEqual(guest);
    expect(withLessonOneGuestFallback([{ lesson_number: 4, external_url: "https://youtu.be/four" }], guest)).toHaveLength(2);
    const uploaded = [{ lesson_number: 1, external_url: "https://cdn.example/lesson-1/demo.mp4" }];
    expect(withLessonOneGuestFallback(uploaded, guest)).toEqual(uploaded);
  });

  it("inserts a Video 1 draft and does not update any other lesson", async () => {
    const api = gateway();
    const file = mp4(27 * 1024 * 1024);
    const saved = await saveLessonOneVideo({
      gateway: api,
      file,
      rows: [row({ id: "lesson-6", lesson_number: 6, language: "en", external_url: "https://youtu.be/six" })],
      replaceConfirmed: false,
      onProgress: vi.fn(),
      now: 10,
      random: "abc123",
    });
    expect(api.updateVideoUrl).not.toHaveBeenCalled();
    expect(api.insertDraft).toHaveBeenCalledWith(expect.stringContaining("/lesson-1/10-abc123-"));
    expect(api.uploadFile).toHaveBeenCalledWith("lesson-1/10-abc123-hajcare-demo.mp4", file, expect.any(Function));
    expect(saved.rowId).toBe("new-id");
  });

  it("does not upload until replacement of the current Video 1 is confirmed", async () => {
    const api = gateway();
    const file = mp4(1024);
    await expect(saveLessonOneVideo({
      gateway: api,
      file,
      rows: [row({ external_url: "https://youtu.be/current" })],
      replaceConfirmed: false,
      onProgress: vi.fn(),
    })).rejects.toBeInstanceOf(LessonOneUploadError);
    expect(api.uploadFile).not.toHaveBeenCalled();
  });

  it("replaces only the Video 1 row and removes the previous uploaded object after success", async () => {
    const previous = "https://begtqcmwruvwposocnsr.supabase.co/storage/v1/object/public/hajj-training-videos/lesson-1/1-oldold-old.mp4";
    const api = gateway();
    await saveLessonOneVideo({
      gateway: api,
      file: mp4(1024),
      rows: [row({ id: "keep-id", external_url: previous, published: true }), row({ id: "lesson-2", lesson_number: 2 })],
      replaceConfirmed: true,
      onProgress: vi.fn(),
      now: 99,
      random: "newnew",
    });
    expect(api.updateVideoUrl).toHaveBeenCalledWith("keep-id", expect.stringContaining("lesson-1/99-newnew-"));
    expect(api.insertDraft).not.toHaveBeenCalled();
    expect(api.removeFile).toHaveBeenCalledWith("lesson-1/1-oldold-old.mp4");
  });

  it("leaves the existing video in place when saving the new URL fails", async () => {
    const api = gateway({
      updateVideoUrl: vi.fn(async () => {
        throw new Error("permission denied");
      }),
    });
    await expect(saveLessonOneVideo({
      gateway: api,
      file: mp4(1024),
      rows: [row({ external_url: null })],
      replaceConfirmed: false,
      onProgress: vi.fn(),
      now: 5,
      random: "zzzzzz",
    })).rejects.toThrow(/permission denied/);
    expect(api.removeFile).toHaveBeenCalledWith("lesson-1/5-zzzzzz-hajcare-demo.mp4");
  });

  it("does not upload when several Video 1 rows exist", async () => {
    const api = gateway();
    await expect(saveLessonOneVideo({
      gateway: api,
      file: mp4(1024),
      rows: [row({ id: "a" }), row({ id: "b" })],
      replaceConfirmed: true,
      onProgress: vi.fn(),
    })).rejects.toThrow(/nothing was changed/);
    expect(api.uploadFile).not.toHaveBeenCalled();
  });
});

describe("Video 1 storage gateway", () => {
  it("refuses anonymous uploads and writes only lesson 1", async () => {
    const requests: string[] = [];
    const writes: Array<Record<string, unknown>> = [];
    const supabase = {
      auth: { getUser: async () => ({ data: { user: { id: "admin-1" } } }) },
      from: () => ({
        select: () => ({
          eq: () => ({
            eq: async () => ({ data: [], error: null }),
          }),
        }),
        insert: (values: Record<string, unknown>) => {
          writes.push(values);
          return { select: () => ({ single: async () => ({ data: { id: "draft-1" }, error: null }) }) };
        },
        update: (values: Record<string, unknown>) => {
          const filters: Array<[string, unknown]> = [];
          const chain = {
            eq(column: string, value: unknown) {
              filters.push([column, value]);
              return chain;
            },
            select: async () => {
              writes.push({ update: values, filters });
              return { data: [{ id: "draft-1" }], error: null };
            },
          };
          return chain;
        },
      }),
    };

    const anon = createLessonOneGateway({
      supabase: supabase as never,
      supabaseUrl: "https://begtqcmwruvwposocnsr.supabase.co",
      supabaseKey: "publishable-test-key",
      getAccessToken: async () => null,
      request: async (args) => {
        requests.push(args.url);
        return { status: 201, body: "" };
      },
    });
    await expect(anon.uploadFile("lesson-1/10-abc123-demo.mp4", mp4(8), vi.fn())).rejects.toThrow(/Sign in as an admin/);
    expect(requests).toEqual([]);
    await expect(anon.uploadFile("lesson-2/10-abc123-demo.mp4", mp4(8), vi.fn())).rejects.toThrow(/not Video 1/);

    const authed = createLessonOneGateway({
      supabase: supabase as never,
      supabaseUrl: "https://begtqcmwruvwposocnsr.supabase.co/",
      supabaseKey: "publishable-test-key",
      getAccessToken: async () => "user-jwt",
      request: async (args) => {
        requests.push(`${args.method} ${args.url} ${args.token}`);
        if (args.onProgress) args.onProgress(50);
        return { status: args.url.includes("missing") ? 400 : 200, body: args.url.includes("missing") ? "Bucket not found" : "" };
      },
    });
    const progress = vi.fn();
    await authed.uploadFile("lesson-1/10-abc123-demo.mp4", mp4(8), progress);
    expect(requests.at(-1)).toContain("/storage/v1/object/hajj-training-videos/lesson-1/10-abc123-demo.mp4");
    expect(requests.at(-1)).toContain("user-jwt");
    expect(progress).toHaveBeenCalledWith(100);
    expect(authed.publicUrl("lesson-1/10-abc123-demo.mp4")).toBe(
      "https://begtqcmwruvwposocnsr.supabase.co/storage/v1/object/public/hajj-training-videos/lesson-1/10-abc123-demo.mp4",
    );

    const id = await authed.insertDraft("https://begtqcmwruvwposocnsr.supabase.co/storage/v1/object/public/hajj-training-videos/lesson-1/10-abc123-demo.mp4");
    expect(id).toBe("draft-1");
    expect(writes[0]).toMatchObject({
      course_id: "hajj-training",
      lesson_number: 1,
      language: "hi",
      platform: "uploaded",
      published: false,
      title: "Video 1",
    });

    await authed.updateVideoUrl("draft-1", "https://example.com/new.mp4");
    expect(writes.at(-1)).toMatchObject({
      update: { platform: "uploaded" },
      filters: [
        ["id", "draft-1"],
        ["course_id", "hajj-training"],
        ["lesson_number", 1],
      ],
    });

    await expect(authed.uploadFile("lesson-1/10-abc123-missing.mp4", mp4(8), vi.fn())).rejects.toThrow(/not set up/);
    expect(messageFromStorageFailure(403, "denied")).toMatch(/not allowed/);
  });
});
