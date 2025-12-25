export function shareToX(caption: string) {
  const text = encodeURIComponent(caption);
  const url = `https://twitter.com/intent/tweet?text=${text}`;
  window.open(url, "_blank");
}
