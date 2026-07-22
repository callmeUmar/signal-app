import { ImageResponse } from "next/og";

export const alt = "Signal — Turn your MIDI into the next idea";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#070907", color: "#edeee7", padding: "62px 72px", fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, letterSpacing: "0.12em" }}>
        <b>● SIGNAL</b><span style={{ color: "#a8ff38" }}>MIDI COPILOT / FL STUDIO</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 78, lineHeight: 0.98, letterSpacing: "-0.055em", fontWeight: 650 }}>
          <span>Turn the MIDI you started</span><span>into the next idea.</span>
        </div>
        <div style={{ color: "#979e94", fontSize: 25 }}>Four controlled directions. Every note stays editable.</div>
      </div>
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        {[18, 45, 28, 64, 39, 76, 52, 91].map((width, index) => (
          <div key={index} style={{ width, height: 14, background: index === 5 ? "#a8ff38" : "#293129", borderRadius: 2 }} />
        ))}
      </div>
    </div>,
    size,
  );
}
