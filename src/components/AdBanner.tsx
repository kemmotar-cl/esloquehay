interface AdBannerProps {
  variant?: 'horizontal' | 'square';
}

/**
 * Componente reservado para publicidad contextual.
 * En producción, reemplazar el placeholder por el script de AdSense
 * o el ad provider elegido.
 */
export default function AdBanner({ variant = 'horizontal' }: AdBannerProps) {
  const sizes = {
    horizontal: 'h-24 sm:h-28',
    square: 'h-64 sm:h-72',
  };

  return (
    <div className="w-full max-w-2xl mx-auto my-6">
      <div
        className={`relative ${sizes[variant]} bg-gray-100 rounded-xl border border-gray-200 flex flex-col items-center justify-center overflow-hidden group`}
      >
        {/* Etiqueta de publicidad */}
        <span className="absolute top-2 right-2 text-[9px] font-bold text-gray-400 uppercase tracking-wider bg-white/80 px-1.5 py-0.5 rounded">
          Publicidad
        </span>

        {/* Placeholder del ad slot */}
        <div className="text-center space-y-1">
          <p className="text-xs text-gray-400 font-medium">Espacio reservado</p>
          <p className="text-[10px] text-gray-300">Google AdSense / Cocina & Gourmet</p>
        </div>

        {/* Aquí iría el script real de AdSense */}
        {/* <ins className="adsbygoogle" style={{ display: 'block' }} data-ad-client="ca-pub-XXXX" data-ad-slot="YYYY" /> */}
      </div>
    </div>
  );
}
