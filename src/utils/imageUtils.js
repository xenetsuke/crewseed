// src/utils/imageUtils.js

export const normalizeImage = async (file) => {
  if (!file || !file.type?.startsWith("image/")) {
    throw new Error("Invalid image file");
  }

  const bitmap = await createImageBitmap(file);
  const canvas = document.createElement("canvas");

  const MAX_WIDTH = 1280;
  const scale = Math.min(1, MAX_WIDTH / bitmap.width);

  canvas.width = bitmap.width * scale;
  canvas.height = bitmap.height * scale;

  const ctx = canvas.getContext("2d");
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);

  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => {
        resolve(
          new File([blob], "attendance.jpg", {
            type: "image/jpeg",
          })
        );
      },
      "image/jpeg",
      0.75 // 🔥 compression
    );
  });
};
