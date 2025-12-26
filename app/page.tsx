"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import ShareCard from "./components/ShareCard";
import WrappedReceipt from "./components/WrappedReceipt";
import { useWrapped } from "./hooks/useWrapped";
import { exportAsImage } from "./utils/exportImage";
import { shareToX } from "./utils/shareToX";
import { generateCaption } from "./utils/generateCaption";
import MiniAppReady from "./components/MiniAppReady";

export default function Home() {
  const [address, setAddress] = useState("");
  const [mounted, setMounted] = useState(false);

  // IMPORTANT: ref points directly to ShareCard root
  const receiptRef = useRef<HTMLDivElement | null>(null);

  const { loading, error, result, generate } = useWrapped();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleDownload = async () => {
    if (!receiptRef.current) return;

    // ensure DOM is painted
    await new Promise((r) => setTimeout(r, 150));
    await new Promise((r) => requestAnimationFrame(r));

    await exportAsImage(receiptRef.current, "base-wrapped-2025.png");
  };

  return (
    <>
      <MiniAppReady />
      {/* TOP BUILDER CAPSULE */}
      <a
        href="https://x.com/rasmalai"
        target="_blank"
        rel="noopener noreferrer"
        className="
    absolute top-6 left-1/2 -translate-x-1/2 z-20
    flex items-center gap-3
    px-4 py-2
    rounded-full
    bg-white/5 backdrop-blur-xl
    border border-white/10
    text-sm text-white/80
    hover:text-white
    hover:bg-white/10
    transition-all
  "
      >
        {/* Avatar */}
        <Image
          src="/rasmalai.jpg" // put your image in /public
          alt="Rasmalai"
          width={28}
          height={28}
          className="rounded-full"
        />

        {/* Text */}
        <span className="font-medium">
          Built by <span className="font-semibold">@rasmalai</span> (𝕏)
        </span>
      </a>

      <main className="relative min-h-screen w-full overflow-hidden bg-[#0a0b1e] flex items-center justify-center px-6 py-12 lg:px-24">
        {/* BACKGROUND */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] rounded-full bg-blue-700/20 blur-[150px] animate-pulseSlow" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-cyan-500/20 blur-[150px] animate-pulseSlow animation-delay-2000" />

          <div className="snow-container opacity-70">
            <div className="snow snow-far" />
            <div className="snow snow-mid" />
            <div className="snow snow-near" />
          </div>
        </div>

        {/* MAIN GRID */}
        <div
          className={`relative z-10 max-w-7xl w-full grid lg:grid-cols-2 gap-12 lg:gap-4 items-center transition-all duration-1000 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          }`}
        >
          {/* LEFT COLUMN */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-6 order-2 lg:order-1">
            {/* HEADER */}
            <div className="relative">
              <div className="absolute -inset-2 bg-blue-500/20 blur-xl rounded-full" />
              <h1 className="relative text-6xl lg:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-linear-to-r from-blue-400 via-cyan-300 to-blue-500">
                BASE
                <span className="block text-4xl lg:text-6xl text-white/90 tracking-widest -mt-1.25 font-bold uppercase">
                  WRAPPED '25
                </span>
              </h1>
              <div className="h-1 w-24 bg-linear-to-r from-blue-500 to-transparent mt-4 mx-auto lg:mx-0 rounded-full" />
            </div>

            <p className="text-lg lg:text-xl text-blue-200/80 max-w-md leading-relaxed pt-2">
              Unwrap your onchain story. A mintable receipt of your activity on
              Base this holiday season.
            </p>

            {/* INPUT */}
            <div className="w-full max-w-md mt-6 p-1.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl">
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Paste wallet address (0x...)"
                  className="flex-1 bg-transparent border-none px-4 py-3 text-white placeholder-blue-200/30 focus:outline-none text-lg font-mono"
                />
                <button
                  onClick={() => generate(address)}
                  disabled={loading}
                  className="relative overflow-hidden rounded-xl bg-blue-600 py-3 px-8 font-bold text-white"
                >
                  {loading ? "Generating…" : "Generate"}
                </button>
              </div>
            </div>

            {/* RECEIPT */}
            {result && (
              <>
                <WrappedReceipt result={result} />

                <div className="flex flex-col sm:flex-row items-center gap-4 mt-6">
                  {/* Download */}
                  <button
                    onClick={handleDownload}
                    className="
      flex items-center justify-center gap-2
      border border-white/20
      px-5 py-2.5
      rounded-xl
      text-sm
      text-white/80
      hover:text-white
      hover:border-white/40
      hover:bg-white/5
      transition-all
      active:scale-[0.97]
    "
                  >
                    Download Base Wrapped
                  </button>

                  {/* Share to X */}
                  <button
                    onClick={() => {
                      if (!result) return;
                      const caption = generateCaption(result);
                      shareToX(caption);
                    }}
                    className="
      flex items-center justify-center gap-2
      px-6 py-3
      rounded-xl
      font-semibold
      text-white
      bg-linear-to-r from-blue-500 to-cyan-400
      shadow-lg shadow-blue-500/30
      hover:shadow-cyan-400/40
      hover:brightness-110
      transition-all
      active:scale-[0.97]
    "
                  >
                    Share to X
                  </button>
                </div>

                {/* HIDDEN BUT PAINTED SHARE CARD */}
                <div
                  style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    transform: "scale(0)",
                    transformOrigin: "top left",
                    pointerEvents: "none",
                    zIndex: -1,
                  }}
                >
                  {/* ref is HERE */}
                  <ShareCard ref={receiptRef} data={result} />
                </div>
              </>
            )}

            {error && <p className="text-red-400 text-sm">{error}</p>}
          </div>

          {/* RIGHT COLUMN */}
          <div className="relative h-100 lg:h-150 w-full flex items-center justify-center order-1 lg:order-2">
            <Image
              src="/hero-ph.png"
              alt="Holiday astronaut"
              width={400}
              height={400}
              priority
            />
          </div>
        </div>
      </main>
    </>
  );
}
