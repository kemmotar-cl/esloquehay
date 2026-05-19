import { ExternalLink, CookingPot, Wine, UtensilsCrossed, ChefHat } from 'lucide-react';

interface AffiliateLink {
  name: string;
  description: string;
  icon: React.ReactNode;
  url: string;
  category: 'utensilios' | 'ingredientes' | 'vino' | 'libros';
}

const AFFILIATE_LINKS: AffiliateLink[] = [
  {
    name: 'Olla de hierro fundido',
    description: 'La base de todo buen guiso. Distribuye el calor de forma uniforme.',
    icon: <CookingPot className="w-4 h-4" />,
    url: '#affiliate-olla',
    category: 'utensilios',
  },
  {
    name: 'Cuchillo de chef profesional',
    description: 'Un buen corte cambia el resultado de cualquier receta.',
    icon: <UtensilsCrossed className="w-4 h-4" />,
    url: '#affiliate-cuchillo',
    category: 'utensilios',
  },
  {
    name: 'Aceite de oliva extra virgen',
    description: 'El secreto de la cocina mediterránea. Directo de España.',
    icon: <Wine className="w-4 h-4" />,
    url: '#affiliate-aceite',
    category: 'ingredientes',
  },
  {
    name: 'Especias gourmet importadas',
    description: 'Curry, zaatar, sumac. Llevá tus platos a otro continente.',
    icon: <ChefHat className="w-4 h-4" />,
    url: '#affiliate-especias',
    category: 'ingredientes',
  },
];

interface AffiliateLinksProps {
  recipeCategory?: string;
}

export default function AffiliateLinks({ recipeCategory }: AffiliateLinksProps) {
  const links = recipeCategory
    ? AFFILIATE_LINKS.filter(
        (l) =>
          l.category === 'utensilios' || l.name.toLowerCase().includes(recipeCategory.toLowerCase())
      )
    : AFFILIATE_LINKS;

  return (
    <div className="w-full max-w-2xl mx-auto mt-6">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="bg-gray-50 px-5 py-3 border-b border-gray-100">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Recomendado para tu cocina
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
            Links de afiliados — comprás al mismo precio, nosotros recibimos una comisión
          </p>
        </div>
      </div>
    </div>
  );
}
