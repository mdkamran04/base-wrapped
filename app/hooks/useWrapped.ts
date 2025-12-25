"use client";

import { useState } from "react";

export function useWrapped() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);

  const generate = async (address: string) => {
    if (!address) return;

    try {
      setLoading(true);
      setError(null);
      setResult(null);

      const res = await fetch(`/api/wrapped?address=${address}`);
      if (!res.ok) throw new Error("Failed to generate wrapped");

      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, result, generate };
}
