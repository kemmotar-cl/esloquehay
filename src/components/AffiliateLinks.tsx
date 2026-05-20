import { ExternalLink, CookingPot, Wine, UtensilsCrossed, ChefHat } from 'lucide-react';

interface AffiliateLink {
  name: string;
  description: string;
  icon: React.ReactNode;
  url: string;
  category: 'utensilios' | 'ingredientes' | 'vino' | 'libros';
}

function getAffiliateLinks(t?: (path: string, fallback?: string) => string): AffiliateLink[] {
  return [
    {
      name: t?.('affiliate.ollaName', 'Olla de hierro fundido') ?? 'Olla de hierro fundido',
      description:
        t?.(
          'affiliate.ollaDesc',
          'La base de todo buen guiso. Distribuye el calor de forma uniforme.'
        ) ?? 'La base de todo buen guiso. Distribuye el calor de forma uniforme.',
      icon: <CookingPot className="w-4 h-4" />,
      url: '#affiliate-olla',
      category: 'utensilios',
    },
    {
      name:
        t?.('affiliate.cuchilloName', 'Cuchillo de chef profesional') ??
        'Cuchillo de chef profesional',
      description:
        t?.('affiliate.cuchilloDesc', 'Un buen corte cambia el resultado de cualquier receta.') ??
        'Un buen corte cambia el resultado de cualquier receta.',
      icon: <UtensilsCrossed className="w-4 h-4" />,
      url: '#affiliate-cuchillo',
      category: 'utensilios',
    },
    {
      name:
        t?.('affiliate.aceiteName', 'Aceite de oliva extra virgen') ??
        'Aceite de oliva extra virgen',
      description:
        t?.('affiliate.aceiteDesc', 'El secreto de la cocina mediterránea. Directo de España.') ??
        'El secreto de la cocina mediterránea. Directo de España.',
      icon: <Wine className="w-4 h-4" />,
      url: '#affiliate-aceite',
      category: 'ingredientes',
    },
    {
      name:
        t?.('affiliate.especiasName', 'Especias gourmet importadas') ??
        'Especias gourmet importadas',
      description:
        t?.(
          'affiliate.especiasDesc',
          'Curry, zaatar, sumac. Llevá tus platos a otro continente.'
        ) ?? 'Curry, zaatar, sumac. Llevá tus platos a otro continente.',
      icon: <ChefHat className="w-4 h-4" />,
      url: '#affiliate-especias',
      category: 'ingredientes',
    },
  ];
}

interface AffiliateLinksProps {
  recipeCategory?: string;
  t?: (path: string, fallback?: string) => string;
}

export default function AffiliateLinks({ recipeCategory, t }: AffiliateLinksProps) {
  const normalizedCategory = recipeCategory?.toLowerCase().trim() ?? '';
  // Extraer palabras significativas del título (ignorar artículos cortos)
  const keywords = normalizedCategory
    .split(/\s+/)
    .filter((w) => w.length > 3 && !['para', 'con', 'los', 'las', 'del', 'una'].includes(w));

  const affiliateLinks = getAffiliateLinks(t);
  const links = normalizedCategory
    ? affiliateLinks.filter(
        (l) =>
          l.category === 'utensilios' || keywords.some((kw) => l.name.toLowerCase().includes(kw))
      )
    : affiliateLinks;

  return (
    <div className="w-full max-w-2xl mx-auto mt-6">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="bg-gray-50 px-5 py-3 border-b border-gray-100">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            {t?.('affiliate.title', 'Recomendado para tu cocina')}
          </p>
        </div>
        <div className="p-4 space-y-3">
          {links.map((link, i) => (
            <a
              key={i}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
            >
              <div className="flex-shrink-0 w-9 h-9 bg-brand-50 text-brand-600 rounded-lg flex items-center justify-center">
                {link.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <h4 className="text-sm font-semibold text-gray-900 group-hover:text-brand-700 transition-colors">
                    {link.name}
                  </h4>
                  <ExternalLink className="w-3 h-3 text-gray-300 group-hover:text-brand-400 transition-colors flex-shrink-0" />
                </div>
                <p className="text-xs text-gray-500 mt-0.5">{link.description}</p>
              </div>
            </a>
          ))}
        </div>
        <div className="px-4 py-2 bg-gray-50 border-t border-gray-100">
          <p className="text-[10px] text-gray-400 text-center">
            {t?.(
              'affiliate.disclaimer',
              'Links de afiliados — comprás al mismo precio, nosotros recibimos una comisión'
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
