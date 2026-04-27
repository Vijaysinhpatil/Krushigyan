"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/crop-analysis");
    } else {
      router.push("/welcome");
    }
  }, [router]);

  return null;
}
