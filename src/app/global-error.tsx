"use client";

// This is the last line of defense: it replaces the ENTIRE root layout
// (including <html>/<body>) when an error is thrown above it — most
// notably from the async data fetches in layout.tsx (getBusinessSettings,
// getProducts). Because the root layout itself may be unavailable, this
// file must not depend on it or on anything that talks to the database:
// no businessConfig, no getBusinessSettings, no shared components. Plain
// HTML with inline styles only, so it can render no matter what broke.
export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1.25rem",
          padding: "1.5rem",
          textAlign: "center",
          backgroundColor: "#fff8f0",
          color: "#2f2a26",
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
        }}
      >
        <p style={{ margin: 0, fontSize: "1.0625rem", maxWidth: "26rem", lineHeight: 1.5 }}>
          Something went wrong. Please try again shortly.
        </p>
        <button
          type="button"
          onClick={() => reset()}
          style={{
            minHeight: "2.75rem",
            padding: "0 1.75rem",
            borderRadius: "0.5rem",
            border: "none",
            backgroundColor: "#d89b5b",
            color: "#fff8f0",
            fontSize: "0.9375rem",
            fontWeight: 500,
            cursor: "pointer",
          }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
