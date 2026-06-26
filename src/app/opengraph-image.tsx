import { ImageResponse } from "next/og";

// LinkedIn / social preview card. Next.js auto-generates the <meta og:image>
// tags (with absolute URL + dimensions) from this file. Warm "Fiat studio" look.
export const alt =
  "Real Estate Intelligence — student-housing acquisitions and development analytics on live public data";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#fffefb",
          backgroundImage:
            "radial-gradient(1100px 460px at 86% -12%, #f0e6cf 0%, rgba(240,230,207,0) 60%)",
          padding: "72px 80px",
          fontFamily: "Georgia, serif",
        }}
      >
        {/* top: brand */}
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "linear-gradient(160deg, #c0973a, #6d5418)",
              color: "#fffefb",
              fontSize: 34,
              fontWeight: 700,
            }}
          >
            RE
          </div>
          <div
            style={{
              fontSize: 24,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: "#8a8273",
              fontFamily: "Arial, sans-serif",
            }}
          >
            Real Estate Intelligence
          </div>
        </div>

        {/* middle: headline */}
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div
            style={{
              fontSize: 62,
              lineHeight: 1.05,
              fontWeight: 600,
              color: "#26231d",
              maxWidth: 980,
            }}
          >
            Where the deals are, and where the supply is going.
          </div>
          <div
            style={{
              fontSize: 28,
              color: "#574f43",
              maxWidth: 920,
              fontFamily: "Arial, sans-serif",
            }}
          >
            Student-housing acquisition scoring and new-construction development
            intelligence, built on 100% live public data.
          </div>
        </div>

        {/* bottom: two suite chips */}
        <div style={{ display: "flex", gap: 16, fontFamily: "Arial, sans-serif" }}>
          {["Student Housing · Acquisitions IQ", "Development Intelligence"].map(
            (label) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  fontSize: 24,
                  fontWeight: 600,
                  color: "#6d5418",
                  background: "#f0e6cf",
                  border: "1px solid #e7d9b6",
                  borderRadius: 999,
                  padding: "12px 26px",
                }}
              >
                {label}
              </div>
            ),
          )}
        </div>
      </div>
    ),
    { ...size },
  );
}
