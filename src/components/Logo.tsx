interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  animated?: boolean;
}

export default function Logo({ size = 'md', showText = true, animated = true }: LogoProps) {
  const sizes = {
    sm: { w: 120, h: 100, text: 'text-lg', iconText: 7 },
    md: { w: 160, h: 130, text: 'text-2xl', iconText: 9 },
    lg: { w: 200, h: 165, text: 'text-3xl', iconText: 11 },
    xl: { w: 280, h: 230, text: 'text-5xl', iconText: 15 },
  };

  const s = sizes[size];

  return (
    <div className="flex flex-col items-center gap-2">
      {/* Logo simbólico: Olla con universo + ingredientes orbitando */}
      <div className={`relative ${animated ? 'group' : ''}`}>
        <svg
          width={s.w}
          height={s.h}
          viewBox="0 0 200 165"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-xl"
        >
          <defs>
            {/* Gradiente cálido de la olla */}
            <linearGradient id="potGrad" x1="60" y1="60" x2="140" y2="140">
              <stop offset="0%" stopColor="#f1923f" />
              <stop offset="50%" stopColor="#de5a0e" />
              <stop offset="100%" stopColor="#933513" />
            </linearGradient>
            {/* Gradiente del universo interior */}
            <radialGradient id="universeGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fef7ee" />
              <stop offset="30%" stopColor="#fdecd5" />
              <stop offset="70%" stopColor="#f1923f" />
              <stop offset="100%" stopColor="#b8420f" />
            </radialGradient>
            {/* Brillo de estrellas */}
            <filter id="starGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="1.2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            {/* Aura de magia */}
            <filter id="magicAura" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Aura de calor/magia detrás de todo */}
          <ellipse cx="100" cy="110" rx="55" ry="30" fill="#f1923f" opacity="0.08" filter="url(#magicAura)" />

          {/* Órbitas de ingredientes */}
          <ellipse
            cx="100" cy="105"
            rx="70" ry="22"
            fill="none"
            stroke="#fad5aa"
            strokeWidth="0.5"
            strokeDasharray="3 3"
            opacity="0.4"
            className={animated ? 'origin-center' : ''}
            style={animated ? { animation: 'spin 20s linear infinite' } : undefined}
          />
          <ellipse
            cx="100" cy="105"
            rx="58" ry="18"
            fill="none"
            stroke="#f1923f"
            strokeWidth="0.5"
            strokeDasharray="2 4"
            opacity="0.3"
            style={animated ? { animation: 'spin 15s linear infinite reverse' } : undefined}
          />

          {/* Ingredientes orbitando */}
          {/* Tomate */}
          <g transform="translate(30, 95)" opacity="0.9">
            <circle cx="0" cy="0" r="8" fill="#fca5a5" />
            <path d="M-3,-5 Q0,-8 3,-5" stroke="#16a34a" strokeWidth="1.5" fill="none" />
          </g>
          {/* Cebolla */}
          <g transform="translate(170, 100)" opacity="0.9">
            <circle cx="0" cy="0" r="7" fill="#e9d5ff" />
            <circle cx="0" cy="0" r="4" fill="#c4b5fd" opacity="0.5" />
          </g>
          {/* Huevo */}
          <g transform="translate(55, 78)" opacity="0.9">
            <ellipse cx="0" cy="0" rx="6" ry="8" fill="#fef3c7" />
            <circle cx="0" cy="1" r="3" fill="#fbbf24" />
          </g>
          {/* Zanahoria */}
          <g transform="translate(145, 78)" opacity="0.9">
            <path d="M-2,6 L0,-6 L2,6 Z" fill="#fb923c" />
            <path d="M-1,-6 L-3,-10 M0,-6 L0,-11 M1,-6 L3,-10" stroke="#16a34a" strokeWidth="1" />
          </g>
          {/* Ajo */}
          <g transform="translate(100, 72)" opacity="0.85">
            <ellipse cx="0" cy="0" rx="5" ry="7" fill="#fef3c7" />
            <ellipse cx="-2" cy="0" rx="2" ry="5" fill="#fde68a" opacity="0.6" />
          </g>

          {/* Humo/aroma subiendo */}
          <path
            d="M85,65 Q80,45 90,30 Q95,20 88,10"
            stroke="#fdecd5"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            opacity="0.5"
            filter="url(#starGlow)"
            className={animated ? 'animate-pulse' : ''}
          />
          <path
            d="M115,65 Q120,45 110,30 Q105,20 112,10"
            stroke="#fad5aa"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
            opacity="0.4"
            filter="url(#starGlow)"
            className={animated ? 'animate-pulse' : ''}
            style={{ animationDelay: '0.5s' }}
          />

          {/* Estrellas en el humo */}
          <g className={animated ? 'animate-pulse' : ''}>
            <path d="M88,18 L89,21 L92,22 L89,23 L88,26 L87,23 L84,22 L87,21 Z" fill="#fef7ee" filter="url(#starGlow)" />
          </g>
          <g className={animated ? 'animate-pulse' : ''} style={{ animationDelay: '0.3s' }}>
            <path d="M112,15 L112.5,16.5 L114,17 L112.5,17.5 L112,19 L111.5,17.5 L110,17 L111.5,16.5 Z" fill="#fef7ee" filter="url(#starGlow)" />
          </g>
          <g className={animated ? 'animate-pulse' : ''} style={{ animationDelay: '0.7s' }}>
            <path d="M100,8 L100.5,9.5 L102,10 L100.5,10.5 L100,12 L99.5,10.5 L98,10 L99.5,9.5 Z" fill="#fdecd5" filter="url(#starGlow)" />
          </g>

          {/* Olla */}
          {/* Borde superior */}
          <ellipse cx="100" cy="65" rx="38" ry="8" fill="#b8420f" />
          <ellipse cx="100" cy="63" rx="35" ry="7" fill="#933513" />
          {/* Cuerpo de la olla */}
          <path
            d="M62,65 L68,120 Q100,132 132,120 L138,65"
            fill="url(#potGrad)"
            stroke="#933513"
            strokeWidth="1"
          />
          {/* Interior del universo */}
          <ellipse cx="100" cy="65" rx="33" ry="6" fill="url(#universeGrad)" />
          {/* Estrellas dentro del universo */}
          <circle cx="85" cy="64" r="1" fill="#fef7ee" opacity="0.9" />
          <circle cx="95" cy="66" r="0.8" fill="#fef7ee" opacity="0.7" />
          <circle cx="108" cy="63" r="1.2" fill="#fef7ee" opacity="0.8" />
          <circle cx="118" cy="65" r="0.6" fill="#fef7ee" opacity="0.9" />
          <circle cx="90" cy="66" r="0.5" fill="#fef7ee" opacity="0.6" />
          {/* Brillo central del universo */}
          <ellipse cx="100" cy="65" rx="8" ry="2" fill="#fef7ee" opacity="0.3" filter="url(#starGlow)" />

          {/* Asas de la olla */}
          <path
            d="M62,72 Q52,75 55,85 Q58,90 64,88"
            fill="none"
            stroke="#933513"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M138,72 Q148,75 145,85 Q142,90 136,88"
            fill="none"
            stroke="#933513"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Base de la olla */}
          <ellipse cx="100" cy="120" rx="32" ry="5" fill="#772d14" />
          <ellipse cx="100" cy="118" rx="28" ry="4" fill="#933513" />

          {/* Fuego bajo la olla */}
          <path
            d="M75,125 Q80,118 85,125 Q90,115 95,125 Q100,112 105,125 Q110,115 115,125 Q120,118 125,125"
            fill="#f1923f"
            opacity="0.6"
            filter="url(#starGlow)"
            className={animated ? 'animate-pulse' : ''}
          />
          <path
            d="M82,128 Q87,122 92,128 Q97,120 102,128 Q107,120 112,128 Q117,122 122,128"
            fill="#de5a0e"
            opacity="0.5"
            filter="url(#starGlow)"
            className={animated ? 'animate-pulse' : ''}
            style={{ animationDelay: '0.3s' }}
          />

          {/* Chispas del fuego */}
          <circle cx="78" cy="118" r="1" fill="#f1923f" opacity="0.8" className={animated ? 'animate-ping' : ''} />
          <circle cx="122" cy="120" r="0.8" fill="#fad5aa" opacity="0.7" className={animated ? 'animate-ping' : ''} style={{ animationDelay: '0.4s' }} />
          <circle cx="95" cy="114" r="0.6" fill="#fdecd5" opacity="0.9" className={animated ? 'animate-ping' : ''} style={{ animationDelay: '0.8s' }} />
        </svg>

        {/* Halo decorativo */}
        {animated && (
          <div className="absolute inset-0 -z-10 rounded-full bg-brand-200 opacity-0 group-hover:opacity-25 transition-opacity duration-700 blur-2xl scale-125" />
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
          {size !== 'sm' && (
            <p className="text-xs text-gray-400 font-medium mt-1.5 tracking-widest uppercase">
              Experiencias gastronómicas
            </p>
          )}
        </div>
      )}
    </div>
  );
}
