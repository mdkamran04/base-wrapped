import { NextResponse } from "next/server";
import { isAddress } from "viem";

const ALCHEMY_URL = `https://base-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`;

// Safe estimate for Base gas (Wrapped-style apps use this)
const ESTIMATED_GAS_PER_TX_ETH = 0.000015;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const address = searchParams.get("address");

  if (!address || !isAddress(address)) {
    return NextResponse.json(
      { error: "Invalid wallet address" },
      { status: 400 }
    );
  }

  const start = new Date("2025-01-01T00:00:00Z");
  const end = new Date("2025-12-31T23:59:59Z");

  let txCount = 0;
  let pageKey: string | undefined;

  // Wrapped stats
  const tokenCounter: Record<string, number> = {};
  const monthCounter = new Array(12).fill(0);
  let firstTxTime: Date | null = null;

  try {
    do {
      /* ---------------- External TXs (count + time) ---------------- */
      const extRes = await fetch(ALCHEMY_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          method: "alchemy_getAssetTransfers",
          params: [{
            fromAddress: address,
            category: ["external"],
            withMetadata: true,
            maxCount: "0xC8",
            pageKey
          }]
        })
      });

      const extJson = await extRes.json();
      const extTransfers = extJson.result?.transfers || [];

      for (const t of extTransfers) {
        if (!t.metadata?.blockTimestamp) continue;

        const ts = new Date(t.metadata.blockTimestamp);
        if (ts < start || ts > end) continue;

        txCount++;

        if (!firstTxTime || ts < firstTxTime) {
          firstTxTime = ts;
        }

        monthCounter[ts.getUTCMonth()]++;
      }

      /* ---------------- ERC20 Transfers (token stats) ---------------- */
      const erc20Res = await fetch(ALCHEMY_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 2,
          method: "alchemy_getAssetTransfers",
          params: [{
            fromAddress: address,
            category: ["erc20"],
            withMetadata: true,
            maxCount: "0xC8",
            pageKey
          }]
        })
      });

      const erc20Json = await erc20Res.json();
      const erc20Transfers = erc20Json.result?.transfers || [];

      for (const t of erc20Transfers) {
        if (!t.rawContract?.address || !t.metadata?.blockTimestamp) continue;

        const ts = new Date(t.metadata.blockTimestamp);
        if (ts < start || ts > end) continue;

        const tokenAddr = t.rawContract.address.toLowerCase();
        tokenCounter[tokenAddr] = (tokenCounter[tokenAddr] || 0) + 1;
      }

      pageKey = extJson.result?.pageKey;
    } while (pageKey);

    /* ---------------- Gas (SAFE estimate) ---------------- */
    const gasSpentEth = (txCount * ESTIMATED_GAS_PER_TX_ETH).toFixed(4);
    const avgGasPerTx =
      txCount > 0
        ? ESTIMATED_GAS_PER_TX_ETH.toFixed(6)
        : "0.000000";

    /* ---------------- Top Token ---------------- */
    let topTokenAddress: string | null = null;
    let topTokenCount = 0;

    for (const [addr, count] of Object.entries(tokenCounter)) {
      if (count > topTokenCount) {
        topTokenCount = count;
        topTokenAddress = addr;
      }
    }

    let topTokenSymbol = "N/A";

    if (topTokenAddress) {
      const metaRes = await fetch(ALCHEMY_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 3,
          method: "alchemy_getTokenMetadata",
          params: [topTokenAddress]
        })
      });

      const metaJson = await metaRes.json();
      topTokenSymbol = metaJson.result?.symbol || "UNKNOWN";
    }

    /* ---------------- Derived Stats ---------------- */
    const monthNames = [
      "January","February","March","April","May","June",
      "July","August","September","October","November","December"
    ];

    const mostActiveMonth =
      monthCounter.some(v => v > 0)
        ? monthNames[monthCounter.indexOf(Math.max(...monthCounter))]
        : "N/A";

    let badge = "Explorer";
    if (txCount >= 150) badge = "Base OG";
    else if (txCount >= 50) badge = "Power User";
    else if (txCount >= 10) badge = "Builder";

    /* ---------------- Final Response ---------------- */
    return NextResponse.json({
      address,
      year: 2025,
      txCount,
      gasSpentEth,
      avgGasPerTx,
      mostActiveMonth,
      firstTxDate: firstTxTime
        ? firstTxTime.toISOString().slice(0, 10)
        : "N/A",
      badge,
      topToken: topTokenAddress
        ? {
            address: topTokenAddress,
            symbol: topTokenSymbol,
            count: topTokenCount
          }
        : null
    });

  } catch (err) {
    console.error("Base Wrapped API error:", err);
    return NextResponse.json(
      { error: "Failed to fetch Base activity" },
      { status: 500 }
    );
  }
}
