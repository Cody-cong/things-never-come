/**
 * 图片上传压缩工具：把 File 读为 data URL，
 * 通过 canvas 等比缩放（最长边限制 800px）后输出 jpeg data URL，
 * 避免大图直接存 localStorage 爆容量。
 */

const MAX_EDGE = 800;
const QUALITY = 0.82;

/** 读取 File 为 data URL（FileReader） */
function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("读取文件失败"));
    reader.readAsDataURL(file);
  });
}

/** 加载图片 data URL 为 HTMLImageElement */
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("图片加载失败"));
    img.src = src;
  });
}

/**
 * 把图片文件压缩缩放为 jpeg data URL。
 * - 最长边 > 800px 时等比缩小到 800px
 * - 最长边 <= 800px 时保持原尺寸
 * - 输出 jpeg 质量 0.82
 */
export async function fileToCompressedDataUrl(
  file: File
): Promise<string> {
  const dataUrl = await readFileAsDataUrl(file);
  const img = await loadImage(dataUrl);

  const { width, height } = img;
  const longest = Math.max(width, height);
  const scale = longest > MAX_EDGE ? MAX_EDGE / longest : 1;

  const w = Math.round(width * scale);
  const h = Math.round(height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("canvas 不可用");
  ctx.drawImage(img, 0, 0, w, h);

  return canvas.toDataURL("image/jpeg", QUALITY);
}
