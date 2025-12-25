"use client";

export default function ReceiptRow({
  label,
  value
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex justify-between">
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}

