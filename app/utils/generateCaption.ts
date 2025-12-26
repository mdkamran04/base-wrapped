export function generateCaption(result: any) {
  return `
Just unwrapped my Base activity 2025 🔵

${result.txCount} transactions
${result.gasSpentEth} ETH in gas
Tier: ${result.badge}

Get your Base Wrapped:
https://base-wrapped25.vercel.app/

Built on @base
`.trim();
}
