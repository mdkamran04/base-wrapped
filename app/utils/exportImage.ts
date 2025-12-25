import * as htmlToImage from "html-to-image";

export async function exportAsImage(
  node: HTMLElement,
  filename: string
) {
  try {
    // Ensure layout + paint
    await new Promise((r) => setTimeout(r, 200));
    await new Promise((r) => requestAnimationFrame(r));

    const blob = await htmlToImage.toBlob(node, {
      pixelRatio: 2,
      cacheBust: true,
      backgroundColor: "#020617"
    });

    if (!blob) {
      throw new Error("Image export failed: empty blob");
    }

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();

    URL.revokeObjectURL(url);
  } catch (err) {
    console.error("exportAsImage error:", err);
  }
}
