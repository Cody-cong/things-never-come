"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CategoryIndexPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/category/ALL");
  }, [router]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="skeleton h-10 w-10 rounded-full" />
    </div>
  );
}
