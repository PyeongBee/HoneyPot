/**
 * Ensures that a provided path is safe to be used inside the app.
 * Externals (http/https, protocol-relative, javascript:) are rejected
 * and fall back to the provided default.
 */
export function normalizeInternalPath(
  rawPath?: string | null,
  fallback = ""
): string {
  if (!rawPath) return fallback;

  const trimmed = rawPath.trim();
  if (!trimmed) return fallback;

  const lower = trimmed.toLowerCase();

  // Disallow protocol-relative inputs.
  if (lower.startsWith("//")) return fallback;

  // Reject obvious javascript/data URLs.
  if (lower.startsWith("javascript:") || lower.startsWith("data:")) {
    return fallback;
  }

  // Handle absolute URLs; only allow same-origin and strip origin.
  if (lower.startsWith("http://") || lower.startsWith("https://")) {
    try {
      const url = new URL(trimmed);
      const currentOrigin =
        typeof window !== "undefined" ? window.location.origin : undefined;
      if (currentOrigin && url.origin === currentOrigin) {
        return normalizeInternalPath(
          `${url.pathname}${url.search}${url.hash}`,
          fallback
        );
      }
    } catch {
      // invalid URL, fall through to fallback below
    }
    return fallback;
  }

  // Reject anything that still contains a colon (likely another protocol)
  if (trimmed.includes(":")) {
    return fallback;
  }

  const normalized = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;

  // Collapse duplicate slashes.
  return normalized.replace(/\/{2,}/g, "/");
}
