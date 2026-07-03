export interface Feedback {
  id: string;
  content: string;
  createdAt: number;
}

const KEY = "gnc_feedback_v1";

function read(): Feedback[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (raw === null) return [];
    const list = JSON.parse(raw) as Feedback[];
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

function write(list: Feedback[]): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(KEY, JSON.stringify(list));
  }
}

export function getFeedbacks(): Feedback[] {
  return read().sort((a, b) => b.createdAt - a.createdAt);
}

export function addFeedback(content: string): Feedback {
  const item: Feedback = {
    id: `fb_${Date.now()}`,
    content: content.trim(),
    createdAt: Date.now(),
  };
  const list = [item, ...read()];
  write(list);
  return item;
}

export function deleteFeedback(id: string): void {
  const list = read().filter((f) => f.id !== id);
  write(list);
}
