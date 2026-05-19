import { useState, useMemo, useCallback, useEffect } from 'react';
import { Settings2, Clock } from 'lucide-react';
import IngredientInput from './components/IngredientInput';
import FloatingIngredients from './components/FloatingIngredients';
import RecipeCard from './components/RecipeCard';
import PreferencesPanel from './components/PreferencesPanel';
import AdBanner from './components/AdBanner';
import AffiliateLinks from './components/AffiliateLinks';
import HistoryPanel from './components/HistoryPanel';
import ShareButton from './components/ShareButton';
import ScrollIndicator from './components/ScrollIndicator';

import { useCountryDetection } from './hooks/useCountry';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useHistory } from './hooks/useHistory';
import { getRandomTagline } from './data/phrases';
import { generateRecipe, checkHealth } from './services/api';
import type { Recipe } from './types/recipe';
import type { UserPreferences } from './types/preferences';
import { DEFAULT_PREFERENCES } from './types/preferences';
import { useI18n, loadTranslations } from './i18n';

const mockRecipe: Recipe = {
  id: '1',
  title: 'Pollo a la cazuela con arroz',
  description:
    'Una receta reconfortante que transforma ingredientes simples en un plato familiar lleno de sabor.',
  experience: 'Comfort food que abraza el alma',
  ingredients: [
    '2 pechugas de pollo cortadas en cubos',
    '1 taza de arroz',
    '1 cebolla picada',
    '2 dientes de ajo',
    '1 zanahoria en rodajas',
    'Caldo de pollo',
    'Aceite de oliva',
    'Sal y pimienta',
    'Orégano al gusto',
  ],
  steps: [
    'Calentá el aceite en una olla grande a fuego medio. Agregá el pollo y doralo por todos lados, unos 5 minutos.',
    'Retirá el pollo y en la misma olla agregá la cebolla y el ajo. Cociná hasta que estén transparentes.',
    'Incorporá la zanahoria y el arroz. Revolvé para que el arroz se impregne con los jugos.',
    'Volvé a poner el pollo en la olla y agregá el caldo hasta cubrir. Condimentá con sal, pimienta y orégano.',
    'Tapá y cociná a fuego bajo por 20-25 minutos hasta que el arroz esté tierno y el pollo cocido.',
    'Dejá reposar 5 minutos antes de servir. ¡Listo!',
  ],
  prepTime: 10,
  cookTime: 30,
  difficulty: 'Fácil',
  servings: 4,
  gourmetTips: [
    {
      title: 'Dorado perfecto del pollo',
      description:
        'No muevas el pollo durante los primeros 3 minutos. Deja que se forme una costra dorada antes de voltear. Esto sella los jugos.',
      technique: 'Maillard Reaction',
    },
    {
      title: 'Caldo casero elevado',
      description:
        'Reemplazá el caldo común por un fondo de pollo reducido. Herví huesos de pollo con cebolla asada, apio y puerro por 4 horas.',
      technique: 'Fondo de cocina',
    },
    {
      title: 'Final con mantequilla',
      description:
        'Agregá una cucharada de mantequilla fría al final y revolvé suavemente. Da brillo y una sensación cremosa inesperada.',
      technique: 'Monté au beurre',
    },
    {
      title: 'Hierbas frescas',
      description:
        'Reemplazá el orégano seco por tomillo fresco y un toque de romero. Aromatiza sin competir con el sabor del pollo.',
      technique: 'Herbes de Provence',
    },
  ],
  variations: [
    {
      name: 'Arroz meloso estilo risotto',
      description:
        'El mismo pollo y arroz, pero cocinado lentamente con caldo caliente de a poco. Queda cremoso y envolvente.',
      extraIngredients: ['Vino blanco', 'Queso parmesano', 'Mantequilla'],
      twist: 'Técnica italiana',
    },
    {
      name: 'Pollo al curry con arroz',
      description:
        'Agregás curry en polvo y leche de coco al caldo. Transforma el plato en una experiencia aromática asiática.',
      extraIngredients: ['Curry en polvo', 'Leche de coco', 'Jengibre fresco'],
      twist: 'Fusión asiática',
    },
    {
      name: 'Cazuela de pollo española',
      description:
        'Agregás pimentón dulce, chorizo en rodajas y garbanzos. Un viaje directo a la cocina mediterránea.',
      extraIngredients: ['Pimentón dulce', 'Chorizo', 'Garbanzos'],
      twist: 'Mediterráneo',
    },
  ],
  winePairing:
    'Un Chardonnay sin roble de Casablanca Valley complementa la cremosidad del plato sin competir con las especias.',
  platingTip:
    'Serví en plato hondo, colocá el pollo encima del arroz en ángulo, y terminá con una gota de aceite de oliva aromatizado en el borde.',
};

const variationMocks: Record<string, Recipe> = {
  'Arroz meloso estilo risotto': {
    ...mockRecipe,
    id: '2',
    title: 'Risotto de pollo y setas',
    description:
      'Cremosidad italiana con el mismo pollo y arroz. Técnica de tostado y incorporación gradual de caldo.',
    experience: 'Un abrazo italiano en cada cuchara',
    prepTime: 5,
    cookTime: 45,
    difficulty: 'Medio',
    ingredients: [
      ...mockRecipe.ingredients,
      '1/2 taza de vino blanco seco',
      '50g queso parmesano rallado',
      '30g mantequilla fría',
    ],
    steps: [
      'Calentá el caldo en una olla aparte y mantenelo a fuego lento.',
      'En olla grande, tostá el arroz con aceite por 2 minutos hasta que esté translúcido.',
      'Agregá el vino blanco y revolvé hasta evaporar.',
      'Incorporá el caldo caliente de a cucharones, revolviendo constantemente.',
      'A los 15 minutos agregá el pollo dorado en cubos.',
      'Cuando el arroz esté al dente, retirá del fuego y agregá la mantequilla y el parmesano.',
      'Dejá reposar 2 minutos tapado antes de servir.',
    ],
    gourmetTips: [
      {
        title: 'Tostado del arroz',
        description:
          'El tostado inicial (tostatura) crea una capa que retiene el almidón. No lo saltees.',
        technique: 'Tostatura',
      },
      {
        title: 'Mantecatura',
        description: 'La mantequilla fría al final (mantecatura) da la cremosidad característica.',
        technique: 'Mantecatura',
      },
      {
        title: 'Caldo siempre caliente',
        description:
          'Si agregás caldo frío, el arroz absorbe líquido sin liberar almidón. Mantenelo humeando.',
        technique: 'Temperatura constante',
      },
    ],
    winePairing: 'Un Pinot Grigio de Alto Adige corta la cremosidad con su acidez brillante.',
    platingTip:
      'Serví en plato hondo, espolvoreá parmesano recién rallado y un hilo de aceite de trufa blanca.',
  },
  'Pollo al curry con arroz': {
    ...mockRecipe,
    id: '3',
    title: 'Pollo al curry rojo con leche de coco',
    description:
      'Fusión asiática que transforma los mismos ingredientes en una explosión aromática.',
    experience: 'Un viaje a Bangkok sin salir de casa',
    prepTime: 10,
    cookTime: 35,
    difficulty: 'Medio',
    ingredients: [
      ...mockRecipe.ingredients,
      '2 cucharadas de curry rojo en pasta',
      '400ml leche de coco',
      'Jengibre fresco rallado',
      'Hojas de albahaca tailandesa',
    ],
    steps: [
      'Dorá el pollo en aceite y reservá.',
      'En la misma olla, sofreí el curry rojo con un poco de leche de coco por 2 minutos.',
      'Agregá la cebolla, el ajo y el jengibre. Cociná 3 minutos.',
      'Incorporá el pollo, el resto de la leche de coco y el caldo.',
      'Herví a fuego lento por 20 minutos.',
      'Agregá el arroz y cociná 15 minutos más.',
      'Finalizá con albahaca fresca y serví.',
    ],
    gourmetTips: [
      {
        title: 'Curry casero',
        description:
          'El curry en pasta de lata es bueno, pero el curry rojo hecho en mortero con chiles secos, ajo, galanga y limoncillo es otro nivel.',
        technique: 'Curry paste from scratch',
      },
      {
        title: 'Leche de coco de primera',
        description:
          'Usá leche de coco sin estabilizantes (se separa en agua y crema). La crema flota y se puede freír antes.',
        technique: 'Coconut cream separation',
      },
    ],
    winePairing: 'Un Riesling semi-seco de Mosela balancea el picante con su dulzor residual.',
    platingTip:
      'Serví en bowl profundo, coroná con albahaca fresca, un gajo de lima y un chorrito de leche de coco.',
  },
  'Cazuela de pollo española': {
    ...mockRecipe,
    id: '4',
    title: 'Cazuela de pollo a la riojana',
    description:
      'Pimentón, chorizo y garbanzos transforman el mismo pollo en un guiso mediterráneo profundo.',
    experience: 'Una tarde en la Rioja',
    prepTime: 15,
    cookTime: 90,
    difficulty: 'Fácil',
    ingredients: [
      ...mockRecipe.ingredients,
      '2 cucharadas de pimentón dulce',
      '150g chorizo en rodajas',
      '1 lata de garbanzos escurridos',
      '1 hoja de laurel',
    ],
    steps: [
      'Dorá el pollo y reservá.',
      'En la misma olla, freí el chorizo hasta soltar su grasa.',
      'Agregá la cebolla y el ajo. Cuando estén transparentes, agregá el pimentón (cuidado, se quema fácil).',
      'Incorporá rápido el pollo, la zanahoria, el laurel y el caldo.',
      'Cociná a fuego lento por 45 minutos.',
      'Agregá el arroz y los garbanzos. Cociná 25 minutos más.',
      'Dejá reposar 10 minutos antes de servir.',
    ],
    gourmetTips: [
      {
        title: 'Pimentón con cuidado',
        description:
          'El pimentón se quema en segundos. Agregalo siempre con líquido cerca y revolvé inmediatamente.',
        technique: 'Sofrito con pimentón',
      },
      {
        title: 'Reposo obligatorio',
        description:
          'Los guisos españoles mejoran con el reposo. Si podés, preparalo un día antes.',
        technique: 'Reposo overnight',
      },
      {
        title: 'Chorizo de calidad',
        description: 'Un chorizo ibérico de bellota cambia todo el plato. Su grasa es el secreto.',
        technique: 'Grasa de chorizo',
      },
    ],
    winePairing:
      'Un Tempranillo joven de La Rioja, con su frutado y taninos suaves, es el compañero perfecto.',
    platingTip:
      'Serví en cazuela de barro si tenés, con un chorrito de aceite de oliva virgen extra por encima.',
  },
};

function App() {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPrefs, setShowPrefs] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const { history, addToHistory, clearHistory, removeFromHistory } = useHistory();
  const [backendReady, setBackendReady] = useState<boolean | null>(null);
  const [preferences, setPreferences] = useLocalStorage<UserPreferences>(
    'esloquehay-prefs',
    DEFAULT_PREFERENCES
  );
  const [ingredients, setIngredients] = useLocalStorage<string[]>('esloquehay-ingredients', []);
  const { lang, switchLanguage, t } = useI18n();

  const { country, countryName, spanishVariant, loading: countryLoading } = useCountryDetection();

  // Initialize language from saved preferences
  useEffect(() => {
    void loadTranslations(preferences.language).then(() => {
      void switchLanguage(preferences.language);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // React to language preference changes
  useEffect(() => {
    if (lang !== preferences.language) {
      void switchLanguage(preferences.language);
    }
  }, [preferences.language, lang, switchLanguage]);

  useEffect(() => {
    void checkHealth().then((h) => {
      setBackendReady(h.keyConfigured);
    });
  }, []);

  const tagline = useMemo(() => getRandomTagline(spanishVariant), [spanishVariant]);

  const addIngredient = useCallback(
    (ing: string) => {
      const clean = ing.toLowerCase().trim();
      setIngredients((prev) => (prev.includes(clean) ? prev : [...prev, clean]));
    },
    [setIngredients]
  );

  const removeIngredient = useCallback(
    (index: number) => {
      setIngredients((prev) => prev.filter((_, i) => i !== index));
    },
    [setIngredients]
  );

  const handleGenerate = useCallback(
    async (variationName?: string, _extraIngredients?: string[]) => {
      setIsLoading(true);

      if (variationName !== undefined && variationName in variationMocks) {
        await new Promise((resolve) => setTimeout(resolve, 800));
        const result = variationMocks[variationName];
        setRecipe(result);
        addToHistory(result);
        setIsLoading(false);
        return;
      }

      if (backendReady) {
        try {
          const result = await generateRecipe({
            ingredients,
            country,
            flavorProfile: preferences.flavorProfile,
            skillLevel: preferences.skillLevel,
            servings: preferences.servings,
            maxPrepTime: preferences.maxPrepTime,
            additionalIngredient: preferences.additionalIngredient,
            budget: preferences.budget,
            language: preferences.language,
          });
          setRecipe(result);
          addToHistory(result);
        } catch {
          setRecipe(mockRecipe);
          addToHistory(mockRecipe);
        }
      } else {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setRecipe(mockRecipe);
        addToHistory(mockRecipe);
      }
      setIsLoading(false);
    },
    [backendReady, ingredients, country, preferences, addToHistory]
  );

  const handleGenerateVariation = useCallback(
    (variationName: string, extraIngredients: string[]) => {
      extraIngredients.forEach((ing) => {
        addIngredient(ing.toLowerCase());
      });
      void handleGenerate(variationName, extraIngredients);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [addIngredient, handleGenerate]
  );

  if (countryLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 text-sm">Detectando tu ubicación...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-8 px-3 sm:px-4 relative overflow-x-hidden">
      {/* Logo de fondo — chef kawaii, 3/4 pantalla, 50% transparencia */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: 'url(/logo.png)',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: '35%',
          opacity: 0.5,
        }}
      />
      {/* Header */}
      <div className="relative z-10 max-w-2xl mx-auto flex items-center justify-between mb-3 sm:mb-4">
        <div className="flex items-center gap-2">
          <span className="text-[10px] sm:text-xs text-gray-400 font-medium">📍 {countryName}</span>
          {backendReady !== null && (
            <span
              className={`text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded-full font-medium ${backendReady ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}
            >
              {backendReady ? '🧠 IA activa' : '⚡ Demo'}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setShowHistory(true);
            }}
            className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 bg-white rounded-xl shadow-sm text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">{t('button.history', 'Historial')}</span>
          </button>
          <button
            onClick={() => {
              setShowPrefs(true);
            }}
            className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 bg-white rounded-xl shadow-sm text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Settings2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">{t('button.preferences', 'Preferencias')}</span>
          </button>
        </div>
      </div>

      {/* Floating Ingredients Cloud — forma de nube */}
      <div
        className="relative z-10 max-w-2xl mx-auto py-4 px-2"
        style={{
          background: 'rgba(255,255,255,0.15)',
          borderRadius: '55% 45% 50% 50% / 45% 55% 45% 55%',
          backdropFilter: 'blur(2px)',
        }}
      >
        <FloatingIngredients
          country={country}
          onSelect={addIngredient}
          selected={ingredients}
          speedMultiplier={preferences.particleSpeed}
          t={t}
        />
      </div>

      {/* Manual Input */}
      <div className="relative z-10">
        <IngredientInput
          ingredients={ingredients}
          tagline={tagline}
          spanishVariant={spanishVariant}
          onAdd={addIngredient}
          onRemove={removeIngredient}
          onGenerate={() => void handleGenerate()}
          isLoading={isLoading}
          t={t}
        />
      </div>

      {/* Ad Banner — debajo del botón generar */}
      <div className="relative z-10">
        <AdBanner variant="horizontal" />
      </div>

      {showHistory && (
        <HistoryPanel
          history={history}
          onSelect={(r) => {
            setRecipe(r);
            setShowHistory(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onClear={clearHistory}
          onRemove={removeFromHistory}
          onClose={() => {
            setShowHistory(false);
          }}
        />
      )}

      {/* Scroll indicator cuando la receta está lista */}
      <ScrollIndicator visible={!!recipe && !isLoading} />

      {/* Recipe Result */}
      {recipe && !isLoading && (
        <div className="relative z-10 mt-6 sm:mt-8">
          <div className="max-w-2xl mx-auto flex items-center justify-between mb-3">
            <ShareButton recipe={recipe} />
            <button
              onClick={() => {
                setShowHistory(true);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-white rounded-xl shadow-sm text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Clock className="w-3.5 h-3.5" />
              {t('button.history', 'Historial')}
            </button>
          </div>
          <RecipeCard recipe={recipe} onGenerateVariation={handleGenerateVariation} />
          <AffiliateLinks recipeCategory={recipe.title.split(' ')[0]} />
          <AdBanner variant="horizontal" />
        </div>
      )}

      {/* Preferences Modal */}
      {showPrefs && (
        <PreferencesPanel
          preferences={preferences}
          onChange={setPreferences}
          onClose={() => {
            setShowPrefs(false);
          }}
        />
      )}

      <footer className="relative z-10 mt-12 sm:mt-16 text-center text-gray-400 text-xs sm:text-sm px-4 pb-8">
        <p>EsLoQueHay © 2026 — {t('footer.motto', 'Creamos momentos, no solo comidas')}</p>
        <p className="text-[10px] text-gray-300 mt-1">
          {t('footer.tagline', 'Hecho con curiosidad y hambre de crear')}
        </p>
      </footer>
    </div>
  );
}

export default App;
