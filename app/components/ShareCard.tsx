"use client";

import { forwardRef } from "react";

/* ---------------- TIER LOGIC (ADDED) ---------------- */
function getUserTier(txCount: number) {
  if (txCount >= 600) return { name: "Base Whale", color: "#facc15" }; // gold
  if (txCount >= 300) return { name: "Onchain OG", color: "#22d3ee" }; // cyan
  if (txCount >= 150) return { name: "Base Native", color: "#60a5fa" }; // blue
  if (txCount >= 69) return { name: "Active Builder", color: "#4ade80" }; // green
  if (txCount >= 15) return { name: "Base Explorer", color: "#a78bfa" }; // violet
  return { name: "Base Newcomer", color: "#94a3b8" }; // gray
}
/* --------------------------------------------------- */

type ShareCardProps = {
  data: {
    year: number;
    address: string;
    txCount: number;
    gasSpentEth: string;
    avgGasPerTx: string;
    mostActiveMonth: string;
    badge: string;
    topToken?: {
      symbol: string;
      count: number;
    } | null;
  };
};

const ShareCard = forwardRef<HTMLDivElement, ShareCardProps>(
  ({ data }, ref) => {
    const tier = getUserTier(data.txCount);

    return (
      <div
        ref={ref}
        style={{
          width: 1080,
          height: 1080,
          backgroundColor: "#020617",
          background:
            "radial-gradient(80% 80% at 50% 0%, #1e40af 0%, #020617 70%)",
          color: "#ffffff",
          padding: 80,
          position: "relative",
          overflow: "hidden",
          fontFamily:
            "Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
        }}
      >
        {/* Soft glow overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 50% 20%, rgba(59,130,246,0.25), transparent 60%)",
            pointerEvents: "none",
          }}
        />

        {/* Header */}
        <div style={{ position: "relative", zIndex: 2 }}>
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
        </div>

        {/* Main Glass Card */}
        <div
          style={{
            marginTop: 60,
            background: "rgba(255,255,255,0.06)",
            borderRadius: 32,
            padding: 48,
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.12)",
            position: "relative",
            zIndex: 2,
          }}
        >
          {/* TOP ROW: Badge + Tier */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 32,
            }}
          >
            {/* Badge on the left */}
            <div
              style={{
                display: "inline-block",
                padding: "10px 18px",
                borderRadius: 999,
                background: "rgba(59,130,246,0.25)",
                fontWeight: 700,
              }}
            >
              {data.badge}
            </div>

            {/* Tier name on the right */}
            <div
              style={{
                fontSize: 26,
                fontWeight: 700,
                letterSpacing: "0.04em",
                color: tier.color,
                textShadow: `0 0 24px ${tier.color}55`,
                whiteSpace: "nowrap",
              }}
            >
              {tier.name}
            </div>
          </div>

          {/* HERO STAT */}
          <div
            style={{
              fontSize: 96,
              fontWeight: 900,
              letterSpacing: "-0.04em",
              lineHeight: 1,
              textShadow: "0 20px 60px rgba(0,0,0,0.5)"
            }}
          >
            {data.txCount}
          </div>

          <div
            style={{
              opacity: 0.7,
              fontSize: 22,
              marginBottom: 40,
            }}
          >
            transactions on Base
          </div>

          {/* Stats Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 24,
              fontSize: 22,
            }}
          >
            <Stat label="Gas Spent" value={`${data.gasSpentEth} ETH`} />
            <Stat label="Most Active Month" value={data.mostActiveMonth} />
            <Stat label="Avg Gas / Tx" value={`${data.avgGasPerTx} ETH`} />

            {data.topToken && (
              <Stat
                label="Top Token"
                value={`${data.topToken.symbol} (${data.topToken.count})`}
              />
            )}
          </div>
        </div>

        {/* Footer (UNCHANGED except layout safety) */}
        <div
          style={{
            position: "absolute",
            bottom: 40,
            left: 80,
            right: 80,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            opacity: 0.65,
            fontSize: 18,
          }}
        >
          <span>
            {data.address.slice(0, 6)}…{data.address.slice(-4)}
          </span>

          <span>
            BaseWrapped by pengi.base.eth
            <span className="px-8">𝕏 : @rasmalai</span>
          </span>

          <span>
            <img src="./base.png" alt="base_logo" height={40} width={40} />
          </span>
        </div>
      </div>
    );
  }
);

ShareCard.displayName = "ShareCard";
export default ShareCard;

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div style={{ opacity: 0.6, marginBottom: 6 }}>{label}</div>
      <div style={{ fontWeight: 600 }}>{value}</div>
    </div>
  );
}
