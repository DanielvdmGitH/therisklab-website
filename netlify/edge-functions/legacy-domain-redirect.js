// Permanent (301) redirect from the retired therisklab.co domain to therisklab.ai.
//
// Why an edge function and not a [[redirects]] rule:
// Netlify canonicalises the request to the site's primary domain BEFORE the
// redirect engine evaluates rules. That is why the four `from = "https://therisklab.co/*"`
// blocks in netlify.toml never matched, and why the host swap was served by Netlify's
// own alias -> primary-domain redirect as a 302 (temporary) instead of our declared 301.
// Edge functions run ahead of the redirect engine and can still see the original Host
// header, so this is the earliest point at which we can set the status code ourselves.

const LEGACY_HOSTS = new Set([
  "therisklab.co",
  "www.therisklab.co",
]);

const CANONICAL_ORIGIN = "https://therisklab.ai";

export default (request) => {
  const url = new URL(request.url);

  // x-forwarded-host preserves the host the visitor actually asked for,
  // which survives the internal canonicalisation to the primary domain.
  const host = (request.headers.get("x-forwarded-host") || url.hostname)
    .toLowerCase()
    .split(":")[0];

  // Not a retired host - hand the request back to the normal pipeline untouched.
  if (!LEGACY_HOSTS.has(host)) {
    return;
  }

  // Preserve the full path and query string so deep links keep their destination.
  const target = CANONICAL_ORIGIN + url.pathname + url.search;

  return new Response(null, {
    status: 301,
    headers: {
      Location: target,
      "Cache-Control": "public, max-age=3600",
    },
  });
};

export const config = {
  path: "/*",
};
