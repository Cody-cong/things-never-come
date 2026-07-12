"use client";

import { useEffect, useMemo, useState } from "react";

function getSearch(): string {
  return typeof window !== "undefined" ? window.location.search : "";
}

/**
 * 在 static export 场景下替代 next/navigation 的 useSearchParams。
 * 基于 window.location.search，并通过重写 history 方法监听 router.push/replace，
 * 确保 URL 查询参数变化时组件能重新响应。
 */
export function useClientSearchParams(): URLSearchParams {
  const [search, setSearch] = useState(getSearch);

  useEffect(() => {
    setSearch(getSearch());
    const handleChange = () => setSearch(getSearch());

    window.addEventListener("popstate", handleChange);

    const originalPush = history.pushState;
    const originalReplace = history.replaceState;
    history.pushState = function (...args) {
      originalPush.apply(this, args);
      handleChange();
    };
    history.replaceState = function (...args) {
      originalReplace.apply(this, args);
      handleChange();
    };

    return () => {
      window.removeEventListener("popstate", handleChange);
      history.pushState = originalPush;
      history.replaceState = originalReplace;
    };
  }, []);

  return useMemo(() => new URLSearchParams(search), [search]);
}
