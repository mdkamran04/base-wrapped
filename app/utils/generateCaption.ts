export function generateCaption(result: any) {
  const lines = [
    `My Base Wrapped ${result.year} ✨`,
    ``,
    `• ${result.txCount} transactions`,
    `• ${result.gasSpentEth} ETH gas spent`,
    result.topToken
      ? `• Top token: ${result.topToken.symbol}`
      : null,
    ``,
    `Built on @base`
  ].filter(Boolean);

  return lines.join("\n");
}
