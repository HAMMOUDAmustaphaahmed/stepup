import { motion, useReducedMotion } from 'framer-motion'

// Faded plant skyline behind the hero, with a network of connected nodes
// above it: the plant's systems, linked.
const BACK = '#e6ebf1'
const FRONT = '#d8dfe7'
const DETAIL = '#cbd4de'

const NODES = [
  [157, 84],
  [308, 64],
  [455, 150],
  [662, 100],
  [790, 170],
  [944, 150],
  [1187, 74],
  [1370, 168],
]

const ARCS = [
  [0, 1, 230, -10],
  [1, 2, 400, 40],
  [2, 3, 560, 40],
  [3, 4, 730, 60],
  [4, 5, 870, 110],
  [5, 6, 1070, 20],
  [6, 7, 1300, 40],
  [1, 3, 480, -40],
  [3, 6, 930, -30],
]

export default function Skyline() {
  const reduce = useReducedMotion()

  return (
    <svg className="hero-bg" viewBox="0 0 1440 300" preserveAspectRatio="xMidYMax meet" aria-hidden>
      <defs>
        <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#fff" stopOpacity="0.35" />
        </linearGradient>
      </defs>

      {/* back layer: distant buildings */}
      <g fill={BACK}>
        <rect x="20" y="210" width="90" height="90" />
        <rect x="240" y="190" width="70" height="110" />
        <rect x="560" y="170" width="60" height="130" />
        <rect x="690" y="200" width="120" height="100" />
        <rect x="1000" y="185" width="80" height="115" />
        <rect x="1250" y="200" width="100" height="100" />
        <rect x="1390" y="220" width="60" height="80" />
      </g>

      {/* front layer: the plant */}
      <g fill={FRONT}>
        {/* sawtooth workshop */}
        <path d="M70 300V215L115 188V215L160 188V215L205 188V215L250 188V215L295 188V215L340 188V300Z" />
        <rect x="150" y="84" width="14" height="131" />
        <rect x="300" y="64" width="16" height="151" />
        {/* tanks */}
        <rect x="380" y="220" width="56" height="80" />
        <ellipse cx="408" cy="220" rx="28" ry="8" />
        <rect x="444" y="200" width="22" height="100" />
        <ellipse cx="455" cy="200" rx="11" ry="4" />
        {/* silo dome */}
        <path d="M490 300V240A44 44 0 0 1 578 240V300Z" />
        {/* process column */}
        <rect x="650" y="100" width="24" height="200" />
        <rect x="638" y="160" width="48" height="5" />
        <rect x="638" y="215" width="48" height="5" />
        {/* offices */}
        <rect x="720" y="170" width="140" height="130" />
        {/* cooling tower */}
        <path d="M900 300Q918 230 908 150H980Q970 230 988 300Z" />
        {/* second workshop */}
        <path d="M1020 300V225L1065 200V225L1110 200V225L1155 200V225L1200 200V225L1245 200V300Z" />
        <rect x="1180" y="74" width="15" height="126" />
        {/* tank farm */}
        <rect x="1290" y="240" width="40" height="60" />
        <ellipse cx="1310" cy="240" rx="20" ry="6" />
        <rect x="1345" y="225" width="50" height="75" />
        <ellipse cx="1370" cy="225" rx="25" ry="7" />
        <rect x="0" y="296" width="1440" height="4" />
      </g>

      {/* windows and pipework */}
      <g fill={DETAIL}>
        {[0, 1, 2, 3].map((r) =>
          [0, 1, 2, 3, 4].map((c) => (
            <rect key={`${r}-${c}`} x={736 + c * 25} y={186 + r * 26} width="12" height="12" />
          )),
        )}
        <rect x="436" y="250" width="56" height="4" />
        <rect x="578" y="262" width="72" height="4" />
        <rect x="1245" y="262" width="45" height="4" />
      </g>

      {/* network over the plant */}
      <g fill="none" stroke="#c4cfdb" strokeWidth="1.5" strokeDasharray="4 6">
        {ARCS.map(([a, b, qx, qy]) => {
          const [x1, y1] = NODES[a]
          const [x2, y2] = NODES[b]
          return <path key={`${a}-${b}`} d={`M${x1} ${y1}Q${qx} ${qy} ${x2} ${y2}`} />
        })}
      </g>
      <g>
        {NODES.map(([x, y], i) => (
          <g key={i}>
            <motion.circle
              cx={x}
              cy={y}
              r="10"
              fill="#2563eb"
              initial={{ opacity: 0.12 }}
              animate={reduce ? undefined : { opacity: [0.06, 0.22, 0.06], scale: [0.8, 1.3, 0.8] }}
              transition={{ duration: 3.2, repeat: Infinity, delay: i * 0.4, ease: 'easeInOut' }}
              style={{ transformOrigin: `${x}px ${y}px` }}
            />
            <circle cx={x} cy={y} r="4.5" fill="#9fb3c9" />
          </g>
        ))}
      </g>

      <rect width="1440" height="300" fill="url(#fade)" />
    </svg>
  )
}
