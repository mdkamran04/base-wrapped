import { NextResponse } from "next/server";
import { isAddress } from "viem";

const ALCHEMY_URL = `https://base-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const address = searchParams.get("address");

  // Validate address
  if (!address || !isAddress(address)) {
    return NextResponse.json(
      { error: "Invalid wallet address" },
      { status: 400 }
    );
  }

  // Base Wrapped 2025 range
  const start = new Date("2025-01-01T00:00:00Z");
  const end = new Date("2025-12-31T23:59:59Z");

  let txCount = 0;
  let totalGasWei = BigInt(0);
  let pageKey: string | undefined;

  try {
    do {
      // 1️⃣ Fetch external transactions (indexed)
      const transferRes = await fetch(ALCHEMY_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          method: "alchemy_getAssetTransfers",
          params: [
            {
              fromAddress: address,
              category: ["external"],
              withMetadata: true,
              maxCount: "0xC8", // 200
              pageKey
            }
          ]
        })
      });

      const transferJson = await transferRes.json();

      if (!transferJson.result) {
        throw new Error("Invalid Alchemy transfer response");
      }

      const transfers = transferJson.result.transfers;

      // 2️⃣ Fetch receipts in parallel
      const receipts = await Promise.all(
        transfers
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
            }).then((r) => r.json())
          )
      );

      // 3️⃣ Aggregate gas
      for (const r of receipts) {
        if (!r.result) continue;

        txCount++;

        totalGasWei +=
          BigInt(r.result.gasUsed) *
          BigInt(r.result.effectiveGasPrice);
      }

      pageKey = transferJson.result.pageKey;
    } while (pageKey);

    // 4️⃣ Convert gas to ETH (4 decimals, no floats)
    const ethScaled = totalGasWei / BigInt(1e14); // 4 decimals
    let ethStr = ethScaled.toString().padStart(5, "0");

    const gasSpentEth =
      ethStr.slice(0, -4) + "." + ethStr.slice(-4);

    return NextResponse.json({
      address,
      year: 2025,
      txCount,
      gasSpentEth
    });
  } catch (err) {
    console.error("Base Wrapped API error:", err);
    return NextResponse.json(
      { error: "Failed to fetch Base activity" },
      { status: 500 }
    );
  }
}
