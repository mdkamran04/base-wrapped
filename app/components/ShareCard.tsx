"use client";

import { forwardRef } from "react";

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
    return (
      <div
        ref={ref}
        style={{
          width: 1080,
          height: 1080,

          // REQUIRED to prevent transparent exports
          backgroundColor: "#020617",
          background:
            "radial-gradient(80% 80% at 50% 0%, #1e40af 0%, #020617 70%)",

          color: "#ffffff",
          padding: 80,
          position: "relative",
          overflow: "hidden",
          fontFamily:
            "Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif"
        }}
      >
        {/* Soft glow overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 50% 20%, rgba(59,130,246,0.25), transparent 60%)",
            pointerEvents: "none"
          }}
        />

        {/* Header */}
        <div style={{ position: "relative", zIndex: 2 }}>
          <div
            style={{
              fontSize: 64,
              fontWeight: 900,
              letterSpacing: "-0.04em",
              textShadow: "0 10px 40px rgba(0,0,0,0.4)"
            }}
          >
            BASE WRAPPED ✨
          </div>

          <div
            style={{
              fontSize: 28,
              opacity: 0.8,
              marginTop: 8
            }}
          >
            {data.year}
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
            zIndex: 2
          }}
        >
          {/* Badge */}
          <div
            style={{
              display: "inline-block",
              padding: "10px 18px",
              borderRadius: 999,
              background: "rgba(59,130,246,0.25)",
              fontWeight: 700,
              marginBottom: 32
            }}
          >
            {data.badge}
          </div>

          {/* Hero Stat */}
          <div
            style={{
              fontSize: 96,
              fontWeight: 900,
              letterSpacing: "-0.04em",
              lineHeight: 1
            }}
          >
            {data.txCount}
          </div>

          <div
            style={{
              opacity: 0.7,
              fontSize: 22,
              marginBottom: 40
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
              fontSize: 22
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

        {/* Footer */}
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
            fontSize: 18
          }}
        >
          <span>
            {data.address.slice(0, 6)}…{data.address.slice(-4)}
          </span>
          <span>base.app</span>
          <span><img src="./base.png" alt="base_logo"height={40} width={40} /></span>
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
