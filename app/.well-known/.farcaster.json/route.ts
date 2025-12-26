export async function GET() {
  return Response.json({
    accountAssociation: {
      header: "",
      payload: "",
      signature: ""
    },
    miniapp: {
      version: "1",
      name: "Base Wrapped",
      subtitle: "Your onchain year on Base",
      description: "Unwrap your Base activity into a beautiful shareable receipt.",
      homeUrl: "https://base-wrapped25.vercel.app",
      iconUrl: "https://base-wrapped25.vercel.app/icon.png",
      splashImageUrl: "https://base-wrapped25.vercel.app/splash.png",
      splashBackgroundColor: "#020617",
      primaryCategory: "finance",
      tags: ["base", "wrapped", "onchain"],
      heroImageUrl: "https://base-wrapped25.vercel.app/og.png",
      ogTitle: "Base Wrapped 2025",
      ogDescription: "See your onchain story on Base.",
      ogImageUrl: "https://base-wrapped25.vercel.app/og.png",
      noindex: false
    }
  });
}
