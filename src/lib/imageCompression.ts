/**
 * Compresses an image file to fit within the specified max size
 * @param file - The image file to compress
 * @param maxSizeMB - Maximum file size in MB (default: 2)
 * @returns Compressed image file
 */
export async function compressImage(file: File, maxSizeMB = 2): Promise<File> {
  // Only compress images, not PDFs
  if (!file.type.startsWith('image/')) {
    return file;
  }

  const img = document.createElement("img");
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Could not get canvas context");
  }

  img.src = URL.createObjectURL(file);
  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = () => reject(new Error("Failed to load image"));
  });

  let width = img.width;
  let height = img.height;

  // Scale down if too wide
  const MAX_WIDTH = 1600;
  if (width > MAX_WIDTH) {
    height *= MAX_WIDTH / width;
    width = MAX_WIDTH;
  }

  canvas.width = width;
  canvas.height = height;
  ctx.drawImage(img, 0, 0, width, height);

  // Clean up object URL
  URL.revokeObjectURL(img.src);

  let quality = 0.8;
  let blob: Blob | null = null;

  // Progressively reduce quality until under max size
  do {
    blob = await new Promise<Blob | null>(resolve =>
      canvas.toBlob(resolve, "image/jpeg", quality)
    );
    quality -= 0.1;
  } while (blob && blob.size / 1024 / 1024 > maxSizeMB && quality > 0.2);

  if (!blob) {
    throw new Error("Failed to compress image");
  }

  // Generate a new filename with .jpg extension
  const originalName = file.name.replace(/\.[^/.]+$/, "");
  return new File([blob], `${originalName}.jpg`, { type: "image/jpeg" });
}

/**
 * Checks if an image needs compression based on file size
 */
export function needsCompression(file: File, maxSizeMB = 2): boolean {
  return file.type.startsWith('image/') && file.size / 1024 / 1024 > maxSizeMB;
}
