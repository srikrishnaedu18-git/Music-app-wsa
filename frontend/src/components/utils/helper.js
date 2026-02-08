export const formatTime = (sec) => {
  if (!sec || isNaN(sec)) return "00:00";
  const mins = Math.floor(sec / 60);
  const secs = Math.floor(sec % 60)
    .toString()
    .padStart(2, "0");
  return `${mins}:${secs}`;
};

