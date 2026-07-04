"use client";

import { useEffect, useState, type ReactNode } from "react";

const AUTH_KEY = "gnc_admin_auth";

async function sha256(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function checkPassword(password: string): Promise<boolean> {
  const configured = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;
  if (!configured) return false;
  const [inputHash, configuredHash] = await Promise.all([
    sha256(password),
    sha256(configured),
  ]);
  return inputHash === configuredHash;
}

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

  async function handleLogin() {
    const ok = await checkPassword(password);
    if (ok) {
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
