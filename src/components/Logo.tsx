interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'giant';
  showText?: boolean;
  animated?: boolean;
}

export default function Logo({ size = 'md', showText = true, animated = true }: LogoProps) {
  const sizes = {
    sm: { w: 80, text: 'text-lg' },
    md: { w: 120, text: 'text-2xl' },
    lg: { w: 160, text: 'text-3xl' },
    xl: { w: 200, text: 'text-5xl' },
    giant: { w: 280, text: 'text-6xl' },
  };

  const s = sizes[size];

  return (
    <div className="flex flex-col items-center gap-2">
      <img
        src="/logo.png"
        alt="EsLoQueHay Logo"
        width={s.w}
        height={s.w}
        className={`drop-shadow-xl object-contain image-auto ${animated ? 'group-hover:scale-105 transition-transform duration-300' : ''}`}
      />
      {showText && (
        <span className={`font-bold tracking-tight text-brand-600 font-georgia ${s.text}`}>
          EsLoQueHay
        </span>
      )}
    </div>
  );
}
