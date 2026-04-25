import Script from "next/script";

interface Props {
  domain?: string;
  scriptUrl?: string;
}

/**
 * Self-hosted Plausible loader. Renders nothing if either env var is missing,
 * which keeps local dev free of analytics noise.
 */
export function PlausibleScript({ domain, scriptUrl }: Props) {
  if (!domain || !scriptUrl) return null;
  return (
    <Script
      defer
      data-domain={domain}
      src={scriptUrl}
      strategy="afterInteractive"
    />
  );
}
