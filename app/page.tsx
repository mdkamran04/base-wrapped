"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function Home() {
  const [address, setAddress] = useState("");
  const [mounted, setMounted] = useState(false);

  // PHASE 4 STATES
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // PHASE 4: API WIRING
  const handleGenerate = async () => {
    if (!address) return;

    try {
      setLoading(true);
      setError(null);
      setResult(null);

      const res = await fetch(`/api/wrapped?address=${address}`);

      if (!res.ok) {
        throw new Error("Failed to generate wrapped");
      }

      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-[#0a0b1e] flex items-center justify-center px-6 py-12 lg:px-24">
      {/* --- DYNAMIC BACKGROUND --- */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] rounded-full bg-blue-700/20 blur-[150px] animate-pulseSlow" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-cyan-500/20 blur-[150px] animate-pulseSlow animation-delay-2000" />

        {/* Snow */}
        <div className="snow-container opacity-70">
          <div className="snow snow-far" />
          <div className="snow snow-mid" />
          <div className="snow snow-near" />
        </div>
      </div>

      {/* --- MAIN CONTENT GRID --- */}
      <div
        className={`relative z-10 max-w-7xl w-full grid lg:grid-cols-2 gap-12 lg:gap-4 items-center transition-all duration-1000 ${
          mounted
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-12"
        }`}
      >
        {/* --- LEFT COLUMN --- */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-6 order-2 lg:order-1">
          {/* --- HEADING --- */}
          <div className="relative">
            <div className="absolute -inset-2 bg-blue-500/20 blur-xl rounded-full" />

            <h1 className="relative text-6xl lg:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-linear-to-r from-blue-400 via-cyan-300 to-blue-500 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]">
              BASE
              <span className="block text-4xl lg:text-6xl text-white/90 tracking-widest -mt-1.25 font-bold uppercase">
                WRAPPED '25
              </span>
            </h1>

            <div className="h-1 w-24 bg-linear-to-r from-blue-500 to-transparent mt-4 mx-auto lg:mx-0 rounded-full" />
          </div>

          <p className="text-lg lg:text-xl text-blue-200/80 max-w-md leading-relaxed pt-2">
            Unwrap your onchain story. A mintable receipt of your activity on Base
            this holiday season.
          </p>

          {/* --- INPUT MODULE --- */}
          <div className="w-full max-w-md mt-6 p-1.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl focus-within:border-blue-400/50 transition-all duration-300">
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Paste wallet address (0x...)"
                className="flex-1 bg-transparent border-none px-4 py-3 text-white placeholder-blue-200/30 focus:outline-none text-lg font-mono"
              />

              <button
                onClick={handleGenerate}
                disabled={loading}
                className="relative overflow-hidden rounded-xl bg-blue-600 py-3 px-8 font-bold text-white transition-all hover:bg-blue-500 active:scale-[0.98] disabled:opacity-50 shadow-[0_0_20px_rgba(37,99,235,0.4)]"
              >
                {loading ? "Generating…" : "Generate"}
              </button>
            </div>

            <p className="px-4 pb-2 pt-2 text-xs text-blue-300/50 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              Read only · No wallet connection
            </p>
          </div>

          {/* --- PHASE 4 RESULT PREVIEW --- */}
          {result && (
            <div className="w-full max-w-md mt-6 rounded-xl bg-black/40 border border-white/10 p-4 text-sm text-white">
              <p>
                <span className="text-white/50">Address:</span>{" "}
                {result.address}
              </p>
              <p>
                <span className="text-white/50">Transactions:</span>{" "}
                {result.txCount}
              </p>
              <p>
                <span className="text-white/50">Gas Spent:</span>{" "}
                {result.gasSpentEth} ETH
              </p>
            </div>
          )}

          {error && (
            <p className="text-red-400 text-sm mt-4">{error}</p>
          )}
        </div>

        {/* --- RIGHT COLUMN VISUALS --- */}
        <div className="relative h-100 lg:h-150 w-full flex items-center justify-center order-1 lg:order-2">
          <div className="absolute z-10 animate-floatComplex">
            <Image
              src="/hero-ph.png"
              alt="Holiday astronaut"
              width={400}
              height={400}
              className="w-70 lg:w-105 h-auto drop-shadow-[0_0_80px_rgba(59,130,246,0.6)]"
              priority
            />
          </div>

          <div className="absolute z-20 -left-10 lg:-left-20 bottom-0 lg:bottom-10 animate-floatComplex animation-delay-2000">
            <div className="relative">
              <Image
                src="/base-tree.png"
                alt="Base Christmas Tree"
                width={300}
                height={300}
                className="w-45 lg:w-75 h-auto drop-shadow-[0_0_60px_rgba(34,211,238,0.4)]"
              />
              <span className="absolute top-1 left-1/2 -translate-x-1/2 h-6 w-6 rounded-full bg-yellow-200/80 animate-sparkleBright blur-md" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
