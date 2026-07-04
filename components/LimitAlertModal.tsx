"use client";

import { AlertCircle } from "lucide-react";

interface LimitAlertModalProps {
  message: string;
  onClose: () => void;
}

export default function LimitAlertModal({ message, onClose }: LimitAlertModalProps) {
  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/40 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-float"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col items-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent-light">
            <AlertCircle size={28} className="text-accent" />
          </div>
          <h2 className="mt-4 text-center text-lg font-semibold text-ink">
            购买数量已达上限
          </h2>
          <p className="mt-2 text-center text-sm leading-relaxed text-muted">
            {message}
          </p>
        </div>
        <button
          onClick={onClose}
          className="mt-6 w-full rounded-full bg-accent py-2.5 text-sm font-medium text-white transition hover:bg-accent-dark"
        >
          我知道了
        </button>
      </div>
    </div>
  );
}
