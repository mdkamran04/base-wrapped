"use client";

import ReceiptRow from "./ReceiptRow";

export default function WrappedReceipt({ result }: { result: any }) {
  return (
    <div className="w-full max-w-md mt-10">
      <div>
        <div className="mb-4 text-xl font-bold text-white/90">
          BASE WRAPPED ' {result.year}
        </div>

        <div className="space-y-2">
          <ReceiptRow
            label="Wallet"
            value={`${result.address.slice(0, 6)}…${result.address.slice(-4)}`}
          />
          <ReceiptRow label="Transactions" value={String(result.txCount)} />
          <ReceiptRow label="Gas Spent" value={`${result.gasSpentEth} ETH`} />
          <ReceiptRow label="Avg Gas / Tx" value={`${result.avgGasPerTx} ETH`} />
          <ReceiptRow label="Most Active Month" value={result.mostActiveMonth} />
          <ReceiptRow label="First Tx" value={result.firstTxDate} />
          <ReceiptRow label="Badge" value={result.badge} />

          {result.topToken && (
            <ReceiptRow
              label="Top Token"
              value={`${result.topToken.symbol} (${result.topToken.count})`}
            />
          )}
        </div>

        <div className="text-sm text-blue-400 mt-4">
          Generated on Base · Read only
        </div>
      </div>
    </div>
  );
}
