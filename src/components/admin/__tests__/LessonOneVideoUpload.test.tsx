import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { LessonOneVideoUpload } from "@/components/admin/LessonOneVideoUpload";
import type { LessonOneGateway, LessonOneRow } from "@/lib/lessonOneVideoUpload";

const row = (overrides: Partial<LessonOneRow> = {}): LessonOneRow => ({
  id: "lesson-1",
  course_id: "hajj-training",
  lesson_number: 1,
  language: "hi",
  external_url: "https://youtu.be/current",
  published: false,
  platform: "youtube",
  ...overrides,
});

const fileOf = (name: string, type: string) => new File([new Uint8Array(32)], name, { type });

describe("LessonOneVideoUpload", () => {
  let gateway: LessonOneGateway;

  beforeEach(() => {
    gateway = {
      listLessonOne: vi.fn(async () => []),
      uploadFile: vi.fn(async (_path: string, _file: File, onProgress: (percent: number) => void) => {
        onProgress(25);
        onProgress(80);
      }),
      removeFile: vi.fn(async () => undefined),
      publicUrl: (path: string) => `https://begtqcmwruvwposocnsr.supabase.co/storage/v1/object/public/hajj-training-videos/${path}`,
      insertDraft: vi.fn(async () => "draft-1"),
      updateVideoUrl: vi.fn(async () => undefined),
    };
  });

  it("renders nothing for visitors who are not admins", () => {
    render(
      <MemoryRouter>
        <LessonOneVideoUpload enabled={false} gateway={gateway} />
      </MemoryRouter>,
    );
    expect(screen.queryByTestId("video-1-upload")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Attach / Upload video")).not.toBeInTheDocument();
    expect(gateway.listLessonOne).not.toHaveBeenCalled();
  });

  it("shows Hindi and English upload copy, progress, and a draft success message", async () => {
    let finishUpload: () => void = () => undefined;
    gateway.uploadFile = vi.fn((_path: string, _file: File, onProgress: (percent: number) => void) => new Promise<void>((resolve) => {
      onProgress(80);
      finishUpload = () => {
        onProgress(100);
        resolve();
      };
    }));
    render(
      <MemoryRouter>
        <LessonOneVideoUpload enabled gateway={gateway} />
      </MemoryRouter>,
    );
    expect(await screen.findByRole("button", { name: /Attach \/ Upload video/ })).toHaveTextContent("वीडियो जोड़ें / अपलोड करें");
    fireEvent.change(screen.getByLabelText("Attach / Upload video"), {
      target: { files: [fileOf("demo.mp4", "video/mp4")] },
    });
    expect(await screen.findByText("Uploading… 80%")).toBeInTheDocument();
    await act(async () => {
      finishUpload();
    });
    expect(await screen.findByText(/saved as a draft/)).toBeInTheDocument();
    await waitFor(() => expect(gateway.insertDraft).toHaveBeenCalled());
    expect(gateway.updateVideoUrl).not.toHaveBeenCalled();
  });

  it("shows a validation error and does not upload a non-mp4", async () => {
    render(
      <MemoryRouter>
        <LessonOneVideoUpload enabled gateway={gateway} />
      </MemoryRouter>,
    );
    await screen.findByLabelText("Attach / Upload video");
    fireEvent.change(screen.getByLabelText("Attach / Upload video"), {
      target: { files: [fileOf("clip.mov", "video/quicktime")] },
    });
    expect(await screen.findByRole("alert")).toHaveTextContent(/MP4/);
    expect(gateway.uploadFile).not.toHaveBeenCalled();
  });

  it("keeps the current Video 1 until replacement is confirmed", async () => {
    gateway.listLessonOne = vi.fn(async () => [row()]);
    render(
      <MemoryRouter>
        <LessonOneVideoUpload enabled gateway={gateway} />
      </MemoryRouter>,
    );
    await screen.findByText(/file attached/);
    fireEvent.change(screen.getByLabelText("Attach / Upload video"), {
      target: { files: [fileOf("replacement.mp4", "video/mp4")] },
    });
    expect(await screen.findByRole("alertdialog")).toHaveTextContent(/मौजूदा वीडियो 1/);
    expect(gateway.uploadFile).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: /Keep current/ }));
    expect(gateway.uploadFile).not.toHaveBeenCalled();
    fireEvent.change(screen.getByLabelText("Attach / Upload video"), {
      target: { files: [fileOf("replacement.mp4", "video/mp4")] },
    });
    fireEvent.click(await screen.findByRole("button", { name: /Replace/ }));
    await waitFor(() => expect(gateway.updateVideoUrl).toHaveBeenCalledWith("lesson-1", expect.stringContaining("/lesson-1/")));
    expect(gateway.insertDraft).not.toHaveBeenCalled();
  });

  it("shows the storage error and does not claim success", async () => {
    gateway.uploadFile = vi.fn(async () => {
      throw new Error("Video storage is not set up on this HajCare project yet.");
    });
    render(
      <MemoryRouter>
        <LessonOneVideoUpload enabled gateway={gateway} />
      </MemoryRouter>,
    );
    await screen.findByLabelText("Attach / Upload video");
    fireEvent.change(screen.getByLabelText("Attach / Upload video"), {
      target: { files: [fileOf("demo.mp4", "video/mp4")] },
    });
    expect(await screen.findByRole("alert")).toHaveTextContent(/not set up/);
    expect(screen.queryByText(/saved as a draft/)).not.toBeInTheDocument();
  });
});
