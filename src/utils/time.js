export const formatTimeIST = (isoString) => {
  if (!isoString) return "--:--";

  const date = new Date(isoString);

  return date.toLocaleTimeString("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};
