"use client";

import { useEffect, useState, type ReactNode } from "react";

const AUTH_KEY = "gnc_admin_auth";
const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD ?? "";

export default function AdminGuard({ children }: { children: ReactNode }) {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    try {
      setAuthed(sessionStorage.getItem(AUTH_KEY) === "1");
    } catch {
      /* ignore */
    }
  }, []);

  function handleLogin() {
    if (ADMIN_PASSWORD && password === ADMIN_PASSWORD) {
      setAuthed(true);
      setError(false);
      try {
        sessionStorage.setItem(AUTH_KEY, "1");
      } catch {
        /* ignore */
      }
    } else {
      setError(true);
    }
  }

  if (!authed) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-sm flex-col items-center justify-center px-6 py-20">
        <div className="w-full rounded-2xl bg-white p-6 shadow-card">
          <h1 className="text-center text-lg font-semibold text-ink">管理端登录</h1>
          <p className="mt-1 text-center text-xs text-muted">请输入访问密码</p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            placeholder="密码"
            className="mt-4 w-full rounded-2xl border border-blush bg-cream/50 px-4 py-2.5 text-sm text-ink outline-none focus:border-accent"
          />
          {error && (
            <p className="mt-2 text-center text-xs text-accent">密码错误</p>
          )}
          <button
            onClick={handleLogin}
            className="mt-4 w-full rounded-full bg-accent py-2.5 text-sm font-medium text-white transition hover:bg-accent-dark"
          >
            进入
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
