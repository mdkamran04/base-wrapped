import { NextResponse } from "next/server";
import { isAddress } from "viem";

const ALCHEMY_URL = `https://base-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`;

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
  let totalGasWei = BigInt(0);
  let pageKey: string | undefined;

  // Wrapped stats
  const tokenCounter: Record<string, number> = {};
  const monthCounter = new Array(12).fill(0);
  let firstTxTime: Date | null = null;

  try {
    do {
      /* ---------------- External TXs (gas + time) ---------------- */
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

      const receipts = await Promise.all(
        extTransfers
          .filter((t: any) => {
            if (!t.hash || !t.metadata?.blockTimestamp) return false;
            const ts = new Date(t.metadata.blockTimestamp);
            return ts >= start && ts <= end;
          })
          .map((t: any) =>
            fetch(ALCHEMY_URL, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                jsonrpc: "2.0",
                id: 1,
                method: "eth_getTransactionReceipt",
                params: [t.hash]
              })
            }).then(r => r.json())
          )
      );

      for (let i = 0; i < receipts.length; i++) {
        const r = receipts[i];
        if (!r.result) continue;

        txCount++;

        totalGasWei +=
          BigInt(r.result.gasUsed) *
          BigInt(r.result.effectiveGasPrice);

        const ts = new Date(extTransfers[i].metadata.blockTimestamp);

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
    const ethScaled = totalGasWei / BigInt(1e14);
    let ethStr = ethScaled.toString().padStart(5, "0");
    const gasSpentEth =
      ethStr.slice(0, -4) + "." + ethStr.slice(-4);

    const avgGasWei =
      txCount > 0 ? totalGasWei / BigInt(txCount) : BigInt(0);

    const avgEthScaled = avgGasWei / BigInt(1e14);
    let avgEthStr = avgEthScaled.toString().padStart(5, "0");
    const avgGasPerTx =
      avgEthStr.slice(0, -4) + "." + avgEthStr.slice(-4);

    const monthNames = [
      "January","February","March","April","May","June",
      "July","August","September","October","November","December"
    ];

    const mostActiveMonth =
      monthNames[monthCounter.indexOf(Math.max(...monthCounter))] || "N/A";

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
