export async function normalizeImage(file) {
  if (!(file instanceof File)) {
    throw new Error("normalizeImage expects File");
  }

  // optional compression logic here
  return new File([file], file.name, {
    type: file.type || "image/jpeg",
    lastModified: Date.now(),
  });
}
