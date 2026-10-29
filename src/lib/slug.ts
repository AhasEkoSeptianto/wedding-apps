/**
 * Utility for formatting and handling couple invitation slugs & URLs.
 * Standard format: /namapengantinpria&pengantinwanita
 * Example: /dimas&sarah
 */

/**
 * Normalizes groom and bride names into a clean slug formatted as:
 * namapengantinpria&pengantinwanita
 * Example: "dimas&sarah"
 */
export function formatCoupleSlug(groom: string, bride?: string): string {
  if (bride) {
    const cleanGroom = (groom || "")
      .split(",")[0]
      .trim()
      .split(" ")[0]
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "");
    const cleanBride = (bride || "")
      .split(",")[0]
      .trim()
      .split(" ")[0]
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "");

    if (cleanGroom && cleanBride) {
      return `${cleanGroom}&${cleanBride}`;
    }
    if (cleanGroom) return cleanGroom;
    if (cleanBride) return cleanBride;
  }

  // If passed a combined string like "Dimas & Sarah", "Dimas dan Sarah", "dimas-sarah"
  const combined = (groom || "")
    .toLowerCase()
    .trim()
    .replace(/\s+dan\s+/g, "&")
    .replace(/\s*\+\s*/g, "&")
    .replace(/-/g, "&");

  const parts = combined
    .split("&")
    .map((p) => p.trim().replace(/[^a-z0-9]/g, ""))
    .filter(Boolean);

  if (parts.length >= 2) {
    return `${parts[0]}&${parts[1]}`;
  }
  if (parts.length === 1 && parts[0]) {
    return parts[0];
  }
  return "dimas&sarah";
}

/**
 * Returns the relative live URL path for a wedding, e.g.:
 * /dimas&sarah
 * /dimas&sarah?to=Bpk.+Bambang
 */
export function getWeddingLivePath(slug: string = "dimas&sarah", guestName?: string): string {
  const cleanSlug = slug.trim() || "dimas&sarah";
  if (guestName && guestName.trim()) {
    return `/${cleanSlug}?to=${encodeURIComponent(guestName.trim())}`;
  }
  return `/${cleanSlug}`;
}

/**
 * Returns the full absolute URL with origin for sharing, e.g.:
 * https://janjisuci.com/dimas&sarah
 * https://janjisuci.com/dimas&sarah?to=Bpk.+Bambang
 */
export function getWeddingLiveUrl(slug: string = "dimas&sarah", guestName?: string): string {
  const origin = typeof window !== "undefined" ? window.location.origin : "https://janjisuci.com";
  return `${origin}${getWeddingLivePath(slug, guestName)}`;
}
