interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'giant';
  showText?: boolean;
  animated?: boolean;
}

export default function Logo({ size = 'md', showText = true, animated = true }: LogoProps) {
  const sizes = {
    sm: { w: 100, h: 90, text: 'text-lg', iconText: 6 },
    md: { w: 140, h: 125, text: 'text-2xl', iconText: 8 },
    lg: { w: 180, h: 160, text: 'text-3xl', iconText: 10 },
    xl: { w: 240, h: 215, text: 'text-5xl', iconText: 14 },
    giant: { w: 320, h: 290, text: 'text-6xl', iconText: 18 },
  };

  const s = sizes[size];

  return (
    <div className="flex flex-col items-center gap-2">
      {/* Logo simbólico: Cocinero pensante con nube de ingredientes */}
      <div className={`relative ${animated ? 'group' : ''}`}>
        <svg
          width={s.w}
          height={s.h}
          viewBox="0 0 280 250"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-xl"
        >
          <defs>
            <linearGradient id="chefGrad" x1="100" y1="80" x2="180" y2="200">
              <stop offset="0%" stopColor="#f1923f" />
              <stop offset="100%" stopColor="#de5a0e" />
            </linearGradient>
            <linearGradient id="apronGrad" x1="120" y1="140" x2="160" y2="220">
              <stop offset="0%" stopColor="#fdecd5" />
              <stop offset="100%" stopColor="#fad5aa" />
            </linearGradient>
            <radialGradient id="cloudGrad" cx="40%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="70%" stopColor="#f9fafb" />
              <stop offset="100%" stopColor="#e5e7eb" />
            </radialGradient>
            <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow
                dx="0"
                dy="2"
                stdDeviation="3"
                floodColor="#000000"
                floodOpacity="0.08"
              />
            </filter>
            <filter id="glowSoft">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* ========== NUBE DE PENSAMIENTO ========== */}
          <g filter="url(#softShadow)">
            {/* Cuerpo principal de la nube */}
            <ellipse cx="200" cy="55" rx="55" ry="32" fill="url(#cloudGrad)" />
            <circle cx="165" cy="50" r="22" fill="url(#cloudGrad)" />
            <circle cx="195" cy="38" r="25" fill="url(#cloudGrad)" />
            <circle cx="230" cy="48" r="20" fill="url(#cloudGrad)" />
            <circle cx="215" cy="68" r="18" fill="url(#cloudGrad)" />
            <circle cx="180" cy="70" r="16" fill="url(#cloudGrad)" />

            {/* Burbuja de conexión */}
            <ellipse cx="140" cy="82" rx="10" ry="7" fill="url(#cloudGrad)" />
            <ellipse cx="125" cy="90" rx="6" ry="4" fill="url(#cloudGrad)" />

            {/* Ingredientes flotando dentro de la nube (semitransparentes) */}
            <g opacity="0.45" filter="url(#glowSoft)">
              <text x="175" y="48" fontSize="14" textAnchor="middle">
                🍅
              </text>
              <text x="200" y="42" fontSize="12" textAnchor="middle">
                🧅
              </text>
              <text x="220" y="52" fontSize="13" textAnchor="middle">
                🧄
              </text>
              <text x="190" y="62" fontSize="11" textAnchor="middle">
                🥕
              </text>
              <text x="210" y="65" fontSize="10" textAnchor="middle">
                🌿
              </text>
              <text x="185" y="55" fontSize="9" textAnchor="middle">
                🥚
              </text>
            </g>

            {/* Rayitos de idea */}
            <path
              d="M245,30 L252,22 M255,35 L264,28 M250,25 L258,18"
              stroke="#f1923f"
              strokeWidth="1.5"
              strokeLinecap="round"
              opacity="0.5"
              className={animated ? 'animate-pulse' : ''}
            />
          </g>

          {/* ========== COCINERO ========== */}
          {/* Cuerpo / Delantal */}
          <path
            d="M90,200 L85,150 Q82,130 100,125 L140,125 Q158,130 155,150 L150,200 Q145,225 120,230 Q95,225 90,200"
            fill="url(#apronGrad)"
            stroke="#b8420f"
            strokeWidth="1.5"
          />
          {/* Bolsillo del delantal */}
          <path
            d="M105,170 L135,170 L133,190 Q120,195 107,190 Z"
            fill="#fef7ee"
            stroke="#b8420f"
            strokeWidth="1"
            opacity="0.6"
          />

          {/* Cuello / Camisa */}
          <path d="M105,125 L120,110 L135,125" fill="#ffffff" stroke="#b8420f" strokeWidth="1" />

          {/* Cabeza */}
          <ellipse
            cx="120"
            cy="95"
            rx="22"
            ry="26"
            fill="#fdecd5"
            stroke="#b8420f"
            strokeWidth="1.5"
          />

          {/* Pelo */}
          <path
            d="M98,85 Q95,65 110,62 Q120,58 130,62 Q145,65 142,85 Q142,95 138,100 Q135,70 120,68 Q105,70 102,100 Q98,95 98,85"
            fill="#772d14"
            stroke="#772d14"
            strokeWidth="1"
          />

          {/* Gorro de chef */}
          <path
            d="M100,72 Q95,50 105,42 Q115,35 125,38 Q135,35 145,42 Q155,50 150,72 Q140,68 125,70 Q110,68 100,72"
            fill="#ffffff"
            stroke="#b8420f"
            strokeWidth="1.5"
          />
          <circle cx="125" cy="50" r="3" fill="#fdecd5" opacity="0.5" />

          {/* Ojos pensantes */}
          <ellipse cx="113" cy="95" rx="3" ry="4" fill="#111827" />
          <ellipse cx="127" cy="95" rx="3" ry="4" fill="#111827" />
          {/* Mirada hacia arriba (pensando en la nube) */}
          <circle cx="114" cy="93" r="1.2" fill="#ffffff" />
          <circle cx="128" cy="93" r="1.2" fill="#ffffff" />

          {/* Cejas arqueadas (pensando) */}
          <path
            d="M108,88 Q113,84 118,88"
            stroke="#772d14"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M122,88 Q127,84 132,88"
            stroke="#772d14"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
          />

          {/* Nariz */}
          <path
            d="M120,98 Q118,104 122,104"
            stroke="#b8420f"
            strokeWidth="1"
            fill="none"
            strokeLinecap="round"
          />

          {/* Boca pensativa (línea recta) */}
          <line
            x1="116"
            y1="108"
            x2="124"
            y2="108"
            stroke="#b8420f"
            strokeWidth="1.2"
            strokeLinecap="round"
          />

          {/* Mejillas */}
          <ellipse cx="108" cy="102" rx="4" ry="2.5" fill="#fca5a5" opacity="0.3" />
          <ellipse cx="132" cy="102" rx="4" ry="2.5" fill="#fca5a5" opacity="0.3" />

          {/* ========== BRAZOS ========== */}
          {/* Brazo izquierdo — mano en la barbilla (pensando) */}
          <path
            d="M85,145 Q70,155 75,170 Q78,178 88,175"
            fill="none"
            stroke="#fdecd5"
            strokeWidth="10"
            strokeLinecap="round"
          />
          <path
            d="M85,145 Q70,155 75,170 Q78,178 88,175"
            fill="none"
            stroke="#b8420f"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          {/* Mano */}
          <ellipse cx="88" cy="175" rx="7" ry="5" fill="#fdecd5" stroke="#b8420f" strokeWidth="1" />
          <line
            x1="85"
            y1="173"
            x2="83"
            y2="168"
            stroke="#b8420f"
            strokeWidth="1"
            strokeLinecap="round"
          />

          {/* Brazo derecho — con cuchillo */}
          <path
            d="M155,145 Q170,155 165,170"
            fill="none"
            stroke="#fdecd5"
            strokeWidth="10"
            strokeLinecap="round"
          />
          <path
            d="M155,145 Q170,155 165,170"
            fill="none"
            stroke="#b8420f"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          {/* Mano con cuchillo */}
          <ellipse
            cx="165"
            cy="170"
            rx="7"
            ry="5"
            fill="#fdecd5"
            stroke="#b8420f"
            strokeWidth="1"
          />
          {/* Cuchillo */}
          <path
            d="M162,168 L180,155 L182,158 L164,172 Z"
            fill="#9ca3af"
            stroke="#6b7280"
            strokeWidth="0.5"
          />
          <rect
            x="158"
            y="166"
            width="8"
            height="3"
            rx="1"
            fill="#4b5563"
            transform="rotate(-35 162 167)"
          />

          {/* ========== BASE / SOMBRA ========== */}
          <ellipse cx="120" cy="232" rx="45" ry="6" fill="#000000" opacity="0.06" />

          {/* ========== BRILLOS DECORATIVOS ========== */}
          <g className={animated ? 'animate-pulse' : ''} opacity="0.4">
            <circle cx="260" cy="25" r="2" fill="#f1923f" />
            <circle cx="270" cy="35" r="1.2" fill="#fad5aa" />
            <circle cx="255" cy="40" r="1" fill="#fdecd5" />
          </g>
        </svg>

        {/* Halo decorativo */}
        {animated && (
          <div className="absolute inset-0 -z-10 rounded-full bg-brand-200 opacity-0 group-hover:opacity-20 transition-opacity duration-700 blur-2xl scale-125" />
        )}
      </div>

      {/* Texto */}
      {showText && (
        <div className="text-center">
          <h1 className={`${s.text} font-black tracking-tight text-gray-900 leading-none`}>
            <span className="text-brand-600">Es</span>
            <span className="text-gray-900">Lo</span>
            <span className="text-brand-600">Que</span>
            <span className="text-gray-900">Hay</span>
          </h1>
          {size !== 'sm' && size !== 'giant' && (
            <p className="text-xs text-gray-400 font-medium mt-1.5 tracking-widest uppercase">
              Experiencias gastronómicas
            </p>
          )}
        </div>
      )}
    </div>
  );
}
