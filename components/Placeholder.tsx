import { Construction } from "lucide-react";

interface PlaceholderProps {
  title: string;
  hint?: string;
}

/** Reusable "under construction" placeholder for routes not yet implemented. */
export default function Placeholder({ title, hint = "建设中，敬请期待" }: PlaceholderProps) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 p-6 text-center">
      <Construction size={48} className="text-brand" />
      <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
      <p className="text-sm text-gray-400">{hint}</p>
    </div>
  );
}
