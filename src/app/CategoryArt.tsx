import type { Category } from "@/lib/categorize";

// Hand-drawn SVG illustrations for each category, shown in the swirl tile.
// They sit on a vivid gradient, so they use fixed colours rather than theme tokens.
// Animation classes (art-*) live in globals.css and switch off under prefers-reduced-motion.

const INK = "#0b0d1f";
const WHITE = "#ffffff";
const BLUE = "#2f6bff";
const PINK = "#e8488a";
const GREEN = "#12c98a";
const YELLOW = "#ffd23f";
const SOFT = "#eef0ff";

const delay = (s: number) => ({ animationDelay: `${s}s` });

function Bus() {
  return (
    <svg viewBox="0 0 200 160" role="img" aria-label="College bus">
      {/* road */}
      <rect x="0" y="128" width="200" height="32" fill={INK} opacity="0.55" />
      <line className="art-dash" x1="0" y1="144" x2="200" y2="144" stroke={WHITE} strokeWidth="3" strokeDasharray="14 12" />
      <g className="art-bob">
        {/* body */}
        <rect x="22" y="46" width="152" height="76" rx="14" fill={WHITE} />
        <rect x="22" y="94" width="152" height="12" fill={BLUE} />
        <rect x="22" y="106" width="152" height="6" fill={PINK} />
        {/* roof sign */}
        <rect x="64" y="36" width="72" height="14" rx="5" fill={INK} />
        <text x="100" y="47" textAnchor="middle" fontSize="10" fontWeight="800" fill={YELLOW} fontFamily="inherit">COLLEGE BUS</text>
        {/* windows */}
        {[30, 62, 94, 126].map((x) => (
          <rect key={x} x={x} y="56" width="26" height="26" rx="5" fill={INK} opacity="0.85" />
        ))}
        <rect x="152" y="56" width="16" height="44" rx="4" fill={INK} opacity="0.85" />
        {/* side lettering */}
        <text x="74" y="104" textAnchor="middle" fontSize="9" fontWeight="900" fill={WHITE} fontFamily="inherit" letterSpacing="1.5">CAMPUS</text>
        {/* headlight + door line */}
        <circle className="art-pulse" cx="168" cy="112" r="4" fill={YELLOW} />
        <line x1="146" y1="56" x2="146" y2="120" stroke={SOFT} strokeWidth="2" />
        {/* wheels */}
        {[52, 144].map((cx) => (
          <g key={cx}>
            <circle cx={cx} cy="122" r="14" fill={INK} />
            <g className="art-spin">
              <circle cx={cx} cy="122" r="6" fill={SOFT} />
              <rect x={cx - 1.5} y="116" width="3" height="12" fill={INK} />
            </g>
          </g>
        ))}
      </g>
      {/* exhaust puffs */}
      <circle className="art-puff" cx="16" cy="112" r="5" fill={WHITE} opacity="0.7" />
      <circle className="art-puff" style={delay(0.6)} cx="16" cy="112" r="4" fill={WHITE} opacity="0.7" />
    </svg>
  );
}

function Timetable() {
  const days = ["MON", "TUE", "WED", "THU", "FRI"];
  const fills = [BLUE, PINK, GREEN, YELLOW, SOFT];
  const slots = ["A1", "B1", "C1", "TA1", "L1", "D1", "E1", "F1", "TB1", "L5", "A2", "B2", "C2", "TA2", "L9", "D2", "E2", "F2", "TB2", "L13"];
  return (
    <svg viewBox="0 0 200 160" role="img" aria-label="Weekly timetable">
      <rect x="14" y="12" width="172" height="138" rx="12" fill={WHITE} />
      <rect x="14" y="12" width="172" height="24" rx="12" fill={INK} />
      <rect x="14" y="26" width="172" height="10" fill={INK} />
      {days.map((d, i) => (
        <text key={d} x={40 + i * 30} y="29" textAnchor="middle" fontSize="8" fontWeight="800" fill={WHITE} fontFamily="inherit">{d}</text>
      ))}
      {slots.map((s, i) => {
        const col = i % 5;
        const row = Math.floor(i / 5);
        const fill = fills[(col + row * 2) % fills.length];
        return (
          <g key={s} className="art-pop" style={delay(0.05 * i)}>
            <rect x={27 + col * 30} y={44 + row * 26} width="26" height="20" rx="5" fill={fill} />
            <text x={40 + col * 30} y={57 + row * 26} textAnchor="middle" fontSize="7" fontWeight="800" fill={fill === SOFT || fill === YELLOW ? INK : WHITE} fontFamily="inherit">{s}</text>
          </g>
        );
      })}
    </svg>
  );
}

function Exam() {
  return (
    <svg viewBox="0 0 200 160" role="img" aria-label="Exam paper and clock">
      {/* paper */}
      <g transform="rotate(-6 80 85)">
        <rect x="30" y="18" width="100" height="128" rx="8" fill={WHITE} />
        <rect x="42" y="30" width="56" height="8" rx="3" fill={INK} />
        {[52, 70, 88, 106, 124].map((y, i) => (
          <g key={y}>
            <rect x="42" y={y} width="10" height="10" rx="2" fill="none" stroke={INK} strokeWidth="2" />
            <path className="art-draw" style={delay(0.3 + i * 0.25)} d={`M44 ${y + 5} l3 3 l6 -7`} fill="none" stroke={i === 3 ? PINK : GREEN} strokeWidth="2.5" strokeLinecap="round" />
            <rect x="58" y={y + 2} width={50 - (i % 2) * 14} height="6" rx="3" fill={SOFT} />
          </g>
        ))}
        <circle className="art-pop" style={delay(1.6)} cx="116" cy="34" r="13" fill={PINK} />
        <text className="art-pop" style={delay(1.6)} x="116" y="38" textAnchor="middle" fontSize="11" fontWeight="900" fill={WHITE} fontFamily="inherit">A+</text>
      </g>
      {/* clock */}
      <circle cx="152" cy="98" r="30" fill={WHITE} stroke={INK} strokeWidth="4" />
      <rect x="146" y="62" width="12" height="7" rx="2" fill={INK} />
      {[0, 90, 180, 270].map((a) => (
        <rect key={a} x="151" y="72" width="2" height="5" fill={INK} transform={`rotate(${a} 152 98)`} />
      ))}
      <line className="art-tick" x1="152" y1="98" x2="152" y2="76" stroke={PINK} strokeWidth="3" strokeLinecap="round" />
      <line x1="152" y1="98" x2="166" y2="98" stroke={INK} strokeWidth="3" strokeLinecap="round" />
      <circle cx="152" cy="98" r="3" fill={INK} />
    </svg>
  );
}

function Assignments() {
  return (
    <svg viewBox="0 0 200 160" role="img" aria-label="Notebook and pencil">
      {/* stacked books */}
      <rect x="18" y="118" width="80" height="14" rx="3" fill={BLUE} />
      <rect x="24" y="104" width="72" height="14" rx="3" fill={PINK} />
      <rect x="20" y="90" width="76" height="14" rx="3" fill={GREEN} />
      {/* open notebook */}
      <g className="art-bob">
        <path d="M70 34 Q110 24 110 30 L110 128 Q110 122 70 132 Z" fill={WHITE} />
        <path d="M150 34 Q110 24 110 30 L110 128 Q110 122 150 132 Z" fill={SOFT} />
        <line x1="110" y1="30" x2="110" y2="128" stroke={INK} strokeWidth="2" />
        {[50, 64, 78, 92, 106].map((y, i) => (
          <line key={y} className="art-write" style={delay(i * 0.35)} x1="78" y1={y} x2="104" y2={y - 2} stroke={INK} strokeWidth="2.5" strokeLinecap="round" />
        ))}
        <rect x="118" y="44" width="24" height="12" rx="4" fill={PINK} />
        <text x="130" y="53" textAnchor="middle" fontSize="8" fontWeight="900" fill={WHITE} fontFamily="inherit">DA</text>
        {[68, 84, 100].map((y, i) => (
          <path key={y} className="art-draw" style={delay(0.8 + i * 0.3)} d={`M120 ${y} l4 4 l8 -9`} fill="none" stroke={GREEN} strokeWidth="3" strokeLinecap="round" />
        ))}
      </g>
      {/* pencil */}
      <g className="art-pencil">
        <rect x="150" y="20" width="12" height="70" rx="2" fill={YELLOW} transform="rotate(28 156 55)" />
        <path d="M168 84 L174 98 L162 90 Z" fill={INK} transform="rotate(0)" />
      </g>
    </svg>
  );
}

function Hackathon() {
  return (
    <svg viewBox="0 0 200 160" role="img" aria-label="Laptop with code and a lightbulb">
      {/* glow + bulb */}
      <circle className="art-glow" cx="100" cy="34" r="26" fill={YELLOW} opacity="0.35" />
      <circle cx="100" cy="32" r="16" fill={YELLOW} />
      <rect x="93" y="46" width="14" height="8" rx="2" fill={WHITE} />
      <path d="M95 28 l5 8 l5 -8" fill="none" stroke={INK} strokeWidth="2" strokeLinecap="round" />
      {[-40, 0, 40].map((a) => (
        <line key={a} className="art-pulse" x1="100" y1="6" x2="100" y2="0" stroke={WHITE} strokeWidth="3" strokeLinecap="round" transform={`rotate(${a} 100 32)`} />
      ))}
      {/* laptop */}
      <rect x="42" y="64" width="116" height="70" rx="8" fill={INK} />
      <rect x="50" y="72" width="100" height="54" rx="4" fill="#161a3a" />
      <text x="62" y="92" fontSize="14" fontWeight="900" fill={GREEN} fontFamily="monospace">&lt;/&gt;</text>
      {[98, 108, 118].map((y, i) => (
        <rect key={y} className="art-type" style={delay(i * 0.4)} x="62" y={y} width={[60, 44, 70][i]} height="5" rx="2" fill={[PINK, BLUE, WHITE][i]} />
      ))}
      <rect className="art-blink" x="110" y="84" width="3" height="10" fill={WHITE} />
      <path d="M30 134 h140 l-10 10 h-120 z" fill={WHITE} />
      {/* trophy */}
      <g className="art-bob" style={delay(0.5)}>
        <path d="M164 30 h20 v8 a10 10 0 0 1 -20 0 z" fill={YELLOW} />
        <rect x="171" y="47" width="6" height="8" fill={YELLOW} />
        <rect x="166" y="55" width="16" height="4" rx="2" fill={WHITE} />
      </g>
    </svg>
  );
}

function Campus() {
  const flags = [PINK, YELLOW, BLUE, GREEN, WHITE, PINK, YELLOW];
  const confetti = [
    [30, PINK], [60, YELLOW], [92, GREEN], [124, WHITE], [156, BLUE], [176, PINK], [46, WHITE], [140, YELLOW],
  ] as const;
  return (
    <svg viewBox="0 0 200 160" role="img" aria-label="Campus event stage with bunting and confetti">
      {/* bunting */}
      <path d="M0 18 Q100 46 200 18" fill="none" stroke={WHITE} strokeWidth="2" />
      {flags.map((f, i) => {
        const x = 14 + i * 28;
        const y = 18 + Math.sin((x / 200) * Math.PI) * 26;
        return <path key={i} className="art-sway" style={delay(i * 0.15)} d={`M${x - 9} ${y} L${x + 9} ${y} L${x} ${y + 18} Z`} fill={f} />;
      })}
      {/* stage */}
      <rect x="20" y="120" width="160" height="24" rx="4" fill={INK} />
      <rect x="20" y="114" width="160" height="8" fill={WHITE} />
      {/* spotlights */}
      <path className="art-glow" d="M40 50 L70 114 L20 114 Z" fill={WHITE} opacity="0.25" />
      <path className="art-glow" style={delay(0.8)} d="M160 50 L180 114 L130 114 Z" fill={WHITE} opacity="0.25" />
      {/* mic */}
      <rect x="98" y="78" width="4" height="36" fill={WHITE} />
      <rect x="93" y="62" width="14" height="22" rx="7" fill={INK} stroke={WHITE} strokeWidth="2" />
      <rect x="88" y="112" width="24" height="4" rx="2" fill={WHITE} />
      {/* confetti */}
      {confetti.map(([x, c], i) => (
        <rect key={i} className="art-fall" style={delay(i * 0.35)} x={x} y="30" width="6" height="9" rx="1.5" fill={c} />
      ))}
    </svg>
  );
}

function Review() {
  return (
    <svg viewBox="0 0 200 160" role="img" aria-label="Magnifying glass over a letter">
      <rect x="30" y="40" width="120" height="84" rx="8" fill={WHITE} />
      <path d="M30 46 L90 92 L150 46" fill="none" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <rect x="40" y="100" width="40" height="6" rx="3" fill={SOFT} />
      <rect x="40" y="110" width="60" height="6" rx="3" fill={SOFT} />
      <circle className="art-pop" style={delay(0.4)} cx="140" cy="44" r="12" fill={PINK} />
      <text className="art-pop" style={delay(0.4)} x="140" y="49" textAnchor="middle" fontSize="13" fontWeight="900" fill={WHITE} fontFamily="inherit">?</text>
      <g className="art-scan">
        <circle cx="120" cy="96" r="24" fill={WHITE} fillOpacity="0.35" stroke={INK} strokeWidth="6" />
        <line x1="138" y1="114" x2="160" y2="136" stroke={INK} strokeWidth="10" strokeLinecap="round" />
      </g>
    </svg>
  );
}

function Other() {
  return (
    <svg viewBox="0 0 200 160" role="img" aria-label="Open box with letters">
      {[[70, PINK, 0], [100, WHITE, 0.4], [130, YELLOW, 0.8]].map(([x, c, d], i) => (
        <g key={i} className="art-float" style={delay(d as number)}>
          <rect x={(x as number) - 16} y="40" width="32" height="22" rx="3" fill={c as string} />
          <path d={`M${(x as number) - 16} 42 L${x} 54 L${(x as number) + 16} 42`} fill="none" stroke={INK} strokeWidth="2" />
        </g>
      ))}
      <path d="M40 82 L100 70 L160 82 L100 94 Z" fill={SOFT} />
      <path d="M40 82 L100 94 L100 144 L40 130 Z" fill={WHITE} />
      <path d="M160 82 L100 94 L100 144 L160 130 Z" fill="#d9dcf7" />
      <path d="M40 82 L22 100 L82 112 L100 94 Z" fill={WHITE} opacity="0.9" />
      <path d="M160 82 L178 100 L118 112 L100 94 Z" fill="#d9dcf7" opacity="0.9" />
    </svg>
  );
}

const ART: Record<Category, () => JSX.Element> = {
  transport: Bus,
  timetable: Timetable,
  exams: Exam,
  assignments: Assignments,
  opportunities: Hackathon,
  campus: Campus,
  review: Review,
  other: Other,
};

export default function CategoryArt({ category }: { category: Category }) {
  const Art = ART[category];
  return (
    <div className="category-art" key={category}>
      <Art />
    </div>
  );
}
