import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const address = searchParams.get("address");

  if (!address) {
    return NextResponse.json(
      { error: "Wallet address required" },
      { status: 400 }
    );
  }

  return NextResponse.json({
    address,
    year: 2025,
    txCount: 0,
    gasSpentEth: "0"
  });
}
