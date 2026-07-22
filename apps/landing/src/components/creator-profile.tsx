const profileNotes = [
  [72, 236, 86], [184, 198, 54], [262, 160, 102], [392, 210, 68],
  [486, 134, 92], [606, 176, 58], [690, 112, 112],
];

const traits = [
  ["RHYTHM", "SYNCOPATED", 82],
  ["CONTOUR", "RISING", 68],
  ["RANGE", "COMPACT", 56],
  ["REPETITION", "EVOLVING", 74],
];

export default function CreatorProfile() {
  return (
    <div className="creator-profile" aria-label="Interpretable creator profile preview">
      <div className="profile-topline"><span>SIGNAL / CREATOR PROFILE</span><strong>07</strong></div>
      <svg viewBox="0 0 860 680" role="img" aria-label="Musical phrase and four interpretable creative traits">
        <g className="profile-grid">
          {[118, 188, 258, 328].map((y) => <path key={y} d={`M54 ${y}H806`} />)}
          {[54, 148, 242, 336, 430, 524, 618, 712, 806].map((x) => <path key={x} d={`M${x} 82V356`} />)}
        </g>
        <text className="profile-overline" x="54" y="60">SELECTED MUSICAL MEMORY / 04 BARS</text>
        <path className="profile-contour" d="M72 245 C192 205 254 168 342 181 S490 133 570 159 S714 102 810 127" />
        {profileNotes.map(([x, y, width], index) => <rect className="profile-note" key={index} x={x} y={y} width={width} height="17" rx="3" />)}

        <g className="profile-traits-visual">
          {traits.map(([name, value, score], index) => {
            const y = 424 + index * 58;
            return (
              <g key={String(name)}>
                <text x="54" y={y}>{name}</text>
                <path d={`M210 ${y - 5}H710`} />
                <rect x="210" y={y - 9} width={Number(score) * 5} height="8" rx="4" />
                <text className="profile-trait-value" x="806" y={y} textAnchor="end">{value}</text>
              </g>
            );
          })}
        </g>
      </svg>
      <div className="profile-footer"><span>Built only from projects you choose</span><i>EXPORT · PAUSE · DELETE</i></div>
    </div>
  );
}
