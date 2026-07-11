export async function saveReceiptAsImage(
  wrapperOrPaper: HTMLElement,
  filename: string,
): Promise<void> {
  const { toPng } = await import("html-to-image");

  const paper = wrapperOrPaper.classList.contains("receipt-paper")
    ? wrapperOrPaper
    : wrapperOrPaper.querySelector<HTMLElement>(".receipt-paper");

  if (!paper) {
    throw new Error("receipt paper not found");
  }

  const RECEIPT_WIDTH = 448; // max-w-md

  // 克隆 receipt-paper 到一个远离视口的容器，
  // 避免被父容器 / 视口高度裁剪，确保长图完整渲染。
  const clone = paper.cloneNode(true) as HTMLElement;
  clone.style.maxWidth = `${RECEIPT_WIDTH}px`;
  clone.style.width = `${RECEIPT_WIDTH}px`;
  clone.style.minHeight = "0";
  clone.style.maxHeight = "none";
  clone.style.height = "auto";
  clone.style.boxShadow = "none";
  clone.style.margin = "0";
  clone.style.paddingBottom = "2.5rem"; // 保持 pb-10
  clone.style.position = "relative";
  clone.style.overflow = "visible";
  clone.style.transform = "none";

  const container = document.createElement("div");
  container.style.position = "absolute";
  container.style.left = "-9999px";
  container.style.top = "-9999px";
  container.style.width = `${RECEIPT_WIDTH}px`;
  container.style.height = "auto";
  container.style.maxHeight = "none";
  container.style.overflow = "visible";
  container.style.backgroundColor = "#F9F5E9";
  container.appendChild(clone);

  document.body.appendChild(container);

  // 强制回流，确保高度计算准确
  void container.offsetHeight;
  const fullHeight = clone.scrollHeight;

  try {
    const dataUrl = await toPng(clone, {
      pixelRatio: 2,
      quality: 0.95,
      backgroundColor: "#F9F5E9",
      width: RECEIPT_WIDTH,
      height: fullHeight,
      style: {
        width: `${RECEIPT_WIDTH}px`,
        maxWidth: `${RECEIPT_WIDTH}px`,
        height: "auto",
        maxHeight: "none",
        overflow: "visible",
      },
    });

    const link = document.createElement("a");
    link.download = filename;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } finally {
    document.body.removeChild(container);
  }
}
