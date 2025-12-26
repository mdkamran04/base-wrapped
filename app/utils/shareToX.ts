export function shareToX(text: string) {
  const baseUrl = "https://twitter.com/intent/tweet";
  const encodedText = encodeURIComponent(text);
  const url = `${baseUrl}?text=${encodedText}`;

  window.open(url, "_blank", "noopener,noreferrer");
}
