import { supabase } from "@/integrations/supabase/client";
import {
  LESSON_ONE_BUCKET,
  LESSON_ONE_COURSE_ID,
  LESSON_ONE_NUMBER,
  LESSON_ONE_PLATFORM,
  LessonOneGateway,
  LessonOneRow,
  LessonOneUploadError,
  assertLessonOnePath,
  messageFromStorageFailure,
} from "@/lib/lessonOneVideoUpload";

type StorageResponse = { status: number; body: string };

type GatewayDeps = {
  supabase: typeof supabase;
  supabaseUrl: string;
  supabaseKey: string;
  getAccessToken: () => Promise<string | null>;
  request?: (args: {
    method: "POST" | "DELETE";
    url: string;
    token: string;
    apikey: string;
    file?: File;
    onProgress?: (percent: number) => void;
  }) => Promise<StorageResponse>;
};

const db = (client: typeof supabase) => client as unknown as {
  from: (table: string) => {
    select: (columns: string) => {
      eq: (column: string, value: unknown) => {
        eq: (column: string, value: unknown) => Promise<{ data: LessonOneRow[] | null; error: { message: string } | null }>;
      };
    };
    insert: (values: Record<string, unknown>) => {
      select: (columns: string) => {
        single: () => Promise<{ data: { id: string } | null; error: { message: string } | null }>;
      };
    };
    update: (values: Record<string, unknown>) => {
      eq: (column: string, value: unknown) => {
        eq: (column: string, value: unknown) => {
          eq: (column: string, value: unknown) => {
            select: (columns: string) => Promise<{ data: { id: string }[] | null; error: { message: string } | null }>;
          };
        };
      };
    };
  };
};

function xhrRequest(args: {
  method: "POST" | "DELETE";
  url: string;
  token: string;
  apikey: string;
  file?: File;
  onProgress?: (percent: number) => void;
}): Promise<StorageResponse> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(args.method, args.url);
    xhr.setRequestHeader("Authorization", `Bearer ${args.token}`);
    xhr.setRequestHeader("apikey", args.apikey);
    if (args.method === "POST") {
      xhr.setRequestHeader("Content-Type", "video/mp4");
      xhr.setRequestHeader("x-upsert", "false");
      xhr.setRequestHeader("cache-control", "3600");
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable && args.onProgress) {
          args.onProgress(Math.min(99, Math.round((event.loaded / event.total) * 100)));
        }
      };
    }
    xhr.onload = () => resolve({ status: xhr.status, body: xhr.responseText || "" });
    xhr.onerror = () => reject(new LessonOneUploadError("Upload failed. Video 1 was not changed. / अपलोड नहीं हुआ। वीडियो 1 नहीं बदला।"));
    xhr.send(args.method === "POST" ? args.file ?? null : null);
  });
}

export function createLessonOneGateway(deps: GatewayDeps): LessonOneGateway {
  const request = deps.request ?? xhrRequest;
  const base = deps.supabaseUrl.replace(/\/$/, "");
  const table = db(deps.supabase);

  const authToken = async () => {
    const token = await deps.getAccessToken();
    if (!token) {
      throw new LessonOneUploadError("Sign in as an admin before uploading Video 1. / वीडियो 1 अपलोड करने के लिए एडमिन साइन-इन करें।");
    }
    return token;
  };

  return {
    async listLessonOne() {
      const { data, error } = await table
        .from("video_links")
        .select("id, course_id, lesson_number, language, external_url, published, platform")
        .eq("course_id", LESSON_ONE_COURSE_ID)
        .eq("lesson_number", LESSON_ONE_NUMBER);
      if (error) throw new LessonOneUploadError(error.message);
      return (data ?? []).filter(
        (row) => row.course_id === LESSON_ONE_COURSE_ID && Number(row.lesson_number) === LESSON_ONE_NUMBER,
      );
    },
    async uploadFile(path, file, onProgress) {
      assertLessonOnePath(path);
      const token = await authToken();
      const response = await request({
        method: "POST",
        url: `${base}/storage/v1/object/${LESSON_ONE_BUCKET}/${path}`,
        token,
        apikey: deps.supabaseKey,
        file,
        onProgress,
      });
      if (response.status < 200 || response.status >= 300) {
        throw new LessonOneUploadError(messageFromStorageFailure(response.status, response.body));
      }
      onProgress(100);
    },
    async removeFile(path) {
      assertLessonOnePath(path);
      const token = await authToken();
      const response = await request({
        method: "DELETE",
        url: `${base}/storage/v1/object/${LESSON_ONE_BUCKET}/${path}`,
        token,
        apikey: deps.supabaseKey,
      });
      if (response.status < 200 || response.status >= 300) {
        throw new LessonOneUploadError(messageFromStorageFailure(response.status, response.body));
      }
    },
    publicUrl(path) {
      assertLessonOnePath(path);
      return `${base}/storage/v1/object/public/${LESSON_ONE_BUCKET}/${path}`;
    },
    async insertDraft(url) {
      const { data: userData } = await deps.supabase.auth.getUser();
      const { data, error } = await table
        .from("video_links")
        .insert({
          lesson_id: crypto.randomUUID(),
          course_id: LESSON_ONE_COURSE_ID,
          title: "Video 1",
          description: null,
          external_url: url,
          platform: LESSON_ONE_PLATFORM,
          language: "hi",
          duration_seconds: null,
          lesson_number: LESSON_ONE_NUMBER,
          lesson_order: 0,
          created_by: userData.user?.id ?? null,
          published: false,
        })
        .select("id")
        .single();
      if (error || !data?.id) throw new LessonOneUploadError(error?.message || "Video 1 draft was not saved.");
      return data.id;
    },
    async updateVideoUrl(id, url) {
      const { data, error } = await table
        .from("video_links")
        .update({ external_url: url, platform: LESSON_ONE_PLATFORM })
        .eq("id", id)
        .eq("course_id", LESSON_ONE_COURSE_ID)
        .eq("lesson_number", LESSON_ONE_NUMBER)
        .select("id");
      if (error) throw new LessonOneUploadError(error.message);
      if (!data?.length) throw new LessonOneUploadError("Video 1 could not be updated.");
    },
  };
}

export function createSupabaseLessonOneGateway(): LessonOneGateway {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
  const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;
  if (!supabaseUrl || !supabaseKey) {
    throw new LessonOneUploadError("Video storage is not configured in this build.");
  }
  return createLessonOneGateway({
    supabase,
    supabaseUrl,
    supabaseKey,
    getAccessToken: async () => {
      const { data } = await supabase.auth.getSession();
      return data.session?.access_token ?? null;
    },
  });
}
