import { useState, useMemo, useCallback, useEffect, lazy, Suspense } from 'react';
import { Settings2, Clock, WifiOff, Wallet } from 'lucide-react';
import IngredientInput from './components/IngredientInput';
import FloatingIngredients from './components/FloatingIngredients';
import RecipeCard from './components/RecipeCard';
import AdBanner from './components/AdBanner';
import AffiliateLinks from './components/AffiliateLinks';
import ShareButton from './components/ShareButton';
import ScrollIndicator from './components/ScrollIndicator';
import ToastContainer from './components/ToastContainer';
import { ErrorBoundary } from './components/ErrorBoundary';

import { useCountryDetection } from './hooks/useCountry';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useHistory } from './hooks/useHistory';
import { useToast } from './hooks/useToast';
import { useOnlineStatus } from './hooks/useOnlineStatus';
import { useVisitCounter } from './hooks/useVisitCounter';
import { getRandomPhrase } from './data/phrases';
import { generateRecipe, checkHealth } from './services/api';
import { logger } from './services/logger';
import { analytics } from './services/analytics';
import type { Recipe } from './types/recipe';
import type { UserPreferences, Country } from './types/preferences';
import { DEFAULT_PREFERENCES } from './types/preferences';
import { userPreferencesSchema } from './types/schemas';
import {
  useI18n,
  loadTranslations,
  LANGUAGE_NAMES,
  LANGUAGE_FLAGS,
  type LanguageCode,
} from './i18n';

const HistoryPanel = lazy(() => import('./components/HistoryPanel'));
const PreferencesPanel = lazy(() => import('./components/PreferencesPanel'));

function App() {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPrefs, setShowPrefs] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const { history, addToHistory, clearHistory, removeFromHistory, exportToJSON, exportToCSV } =
    useHistory();
  const { toasts, addToast, removeToast } = useToast();
  const isOnline = useOnlineStatus();
  const visitCount = useVisitCounter();

  const [sessionId] = useState(() => {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return Math.random().toString(36).slice(2) + Date.now().toString(36);
  });
  const [backendReady, setBackendReady] = useState<boolean | null>(null);
  const [preferences, setPreferences] = useLocalStorage<UserPreferences>(
    'esloquehay-prefs',
    DEFAULT_PREFERENCES,
    userPreferencesSchema
  );
  const [ingredients, setIngredients] = useState<string[]>([]);
  const { lang, switchLanguage, t, ta } = useI18n();

  const { country, loading: countryLoading } = useCountryDetection();
  const [recipeCountryOverride, setRecipeCountryOverride] = useState<Country | null>(null);
  const recipeCountry = recipeCountryOverride ?? country;

  // Clear persisted ingredients from previous sessions (no longer desired)
  useEffect(() => {
    localStorage.removeItem('esloquehay-ingredients');
  }, []);

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
    void checkHealth(sessionId).then((h) => {
      setBackendReady(h.keyConfigured);
    });
  }, [sessionId]);

  // Track page view on mount
  useEffect(() => {
    analytics.pageView('/');
  }, []);

  const tagline = useMemo(() => {
    return getRandomPhrase(ta('taglines'));
  }, [ta]);

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
    async (
      variationName?: string,
      _extraIngredients?: string[],
      budgetOverride?: UserPreferences['budget']
    ) => {
      if (!isOnline) {
        addToast({
          message: t('offline.error', 'Sin conexión. Conectate a internet para generar recetas.'),
          type: 'warning',
        });
        return;
      }
      setIsLoading(true);
      analytics.track('recipe_generate_start', {
        ingredientCount: ingredients.length,
        country: recipeCountry,
        variation: variationName,
      });

      if (variationName !== undefined) {
        const { variationMocks } = await import('./mocks/recipes');
        if (variationName in variationMocks) {
          await new Promise((resolve) => setTimeout(resolve, 800));
          const result = { ...variationMocks[variationName], source: 'variation' as const };
          setRecipe(result);
          addToHistory({
            recipe: result,
            timestamp: Date.now(),
            ingredients: [...ingredients],
            preferencesSnapshot: { ...preferences },
            source: 'variation',
            sessionId,
          });
          analytics.track('recipe_generate_success', { source: 'variation', variationName });
          addToast({ message: t('toast.variation_ready', '¡Variación lista!'), type: 'success' });
          setIsLoading(false);
          return;
        }
      }

      if (backendReady) {
        try {
          const result = await generateRecipe(
            {
              ingredients,
              country: recipeCountry,
              flavorProfile: preferences.flavorProfile,
              skillLevel: preferences.skillLevel,
              servings: preferences.servings,
              maxPrepTime: preferences.maxPrepTime,
              additionalIngredient: preferences.additionalIngredient,
              budget: budgetOverride ?? preferences.budget,
              language: preferences.language,
              dietaryRestrictions:
                preferences.dietaryRestriction !== 'none'
                  ? [preferences.dietaryRestriction]
                  : undefined,
              experienceMode: false,
            },
            sessionId
          );
          setRecipe({ ...result, source: 'ia' as const });
          addToHistory({
            recipe: { ...result, source: 'ia' as const },
            timestamp: Date.now(),
            ingredients: [...ingredients],
            preferencesSnapshot: { ...preferences },
            source: 'ia',
            sessionId,
          });
          analytics.track('recipe_generate_success', { source: 'ia' });
          addToast({ message: t('toast.recipe_ready', '¡Receta generada!'), type: 'success' });
        } catch (e) {
          logger.error('App', 'generateRecipe failed, falling back to mock', e);
          analytics.track('recipe_generate_fallback', { reason: 'api_error' });
          const { mockRecipe } = await import('./mocks/recipes');
          const mocked = { ...mockRecipe, source: 'mock' as const };
          setRecipe(mocked);
          addToHistory({
            recipe: mocked,
            timestamp: Date.now(),
            ingredients: [...ingredients],
            preferencesSnapshot: { ...preferences },
            source: 'mock',
            sessionId,
          });
          addToast({
            message: t('toast.fallback_mode', 'Modo demo activado — la receta es de ejemplo'),
            type: 'warning',
            duration: 6000,
          });
        }
      } else {
        analytics.track('recipe_generate_fallback', { reason: 'backend_unavailable' });
        await new Promise((resolve) => setTimeout(resolve, 1500));
        const { mockRecipe } = await import('./mocks/recipes');
        const mocked = { ...mockRecipe, source: 'mock' as const };
        setRecipe(mocked);
        addToHistory({
          recipe: mocked,
          timestamp: Date.now(),
          ingredients: [...ingredients],
          preferencesSnapshot: { ...preferences },
          source: 'mock',
          sessionId,
        });
        addToast({
          message: t('toast.demo_mode', 'Modo demo — conectá el backend para recetas reales'),
          type: 'info',
          duration: 6000,
        });
      }
      setIsLoading(false);
    },
    [
      backendReady,
      ingredients,
      recipeCountry,
      preferences,
      addToHistory,
      sessionId,
      isOnline,
      addToast,
      t,
    ]
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
          <p className="text-gray-500 text-sm">
            {t('app.detectingLocation', 'Detectando tu ubicación...')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary t={t}>
      <div className="min-h-screen bg-gray-50 py-6 sm:py-8 px-3 sm:px-4 relative overflow-x-hidden">
        {/* Skip link for keyboard navigation */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:bg-brand-600 focus:text-white focus:px-4 focus:py-2 focus:rounded-xl focus:text-sm focus:font-medium"
        >
          {t('app.skipLink', 'Saltar al contenido principal')}
        </a>
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
        {/* Toast notifications */}
        <ToastContainer toasts={toasts} onRemove={removeToast} />

        {/* Offline indicator */}
        {!isOnline && (
          <div className="fixed top-0 left-0 right-0 z-[90] bg-amber-100 text-amber-800 text-xs font-medium text-center py-1.5 flex items-center justify-center gap-1.5">
            <WifiOff className="w-3.5 h-3.5" />
            {t('offline.banner', 'Sin conexión a internet')}
          </div>
        )}

        {/* Header */}
        <div
          className={`relative z-10 max-w-2xl mx-auto flex items-center justify-between mb-3 sm:mb-4 ${!isOnline ? 'mt-6' : ''}`}
        >
          <div className="flex items-center gap-2">
            <span className="text-[10px] sm:text-xs text-gray-400 font-medium">
              📍 {t(`countries.${country}`, country)}
            </span>
            <span
              className="text-[10px] sm:text-xs text-gray-300 font-medium"
              title={t('visitCounter', 'Visitas').replace('{count}', String(visitCount))}
            >
              👁 {visitCount}
            </span>
            {backendReady !== null && (
              <span
                className={`text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded-full font-medium ${backendReady ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}
              >
                {backendReady
                  ? `🧠 ${t('app.iaActive', 'IA activa')}`
                  : `⚡ ${t('app.demoMode', 'Demo')}`}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {/* Language selector — visible always */}
            <div className="relative">
              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-sm pointer-events-none z-10">
                {LANGUAGE_FLAGS[preferences.language]}
              </span>
              <select
                value={preferences.language}
                onChange={(e) => {
                  const code = e.target.value as LanguageCode;
                  setPreferences((prev) => ({ ...prev, language: code }));
                  analytics.track('language_change', { language: code });
                }}
                className="pl-7 pr-2 py-2 bg-white rounded-xl shadow-sm text-xs font-medium text-gray-700 border-none focus:ring-2 focus:ring-brand-500 cursor-pointer"
                title={t('app.language', 'Idioma')}
              >
                {Object.entries(LANGUAGE_NAMES).map(([key, label]) => (
                  <option key={key} value={key}>
                    {LANGUAGE_FLAGS[key as LanguageCode]} {label}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={() => {
                setShowHistory(true);
                analytics.track('history_open');
              }}
              className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 bg-white rounded-xl shadow-sm text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">{t('button.history', 'Historial')}</span>
            </button>
            <button
              onClick={() => {
                setShowPrefs(true);
                analytics.track('preferences_open');
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
        <div id="main-content" className="relative z-10">
          <IngredientInput
            key={lang}
            ingredients={ingredients}
            tagline={tagline}
            country={recipeCountry}
            onCountryChange={setRecipeCountryOverride}
            onAdd={addIngredient}
            onRemove={removeIngredient}
            onGenerate={() => void handleGenerate()}
            isLoading={isLoading}
            t={t}
            ta={ta}
          />
        </div>

        {/* Quick budget recipe button */}
        <div className="relative z-10 max-w-2xl mx-auto mt-3">
          <button
            onClick={() => {
              void handleGenerate(undefined, undefined, 'low');
            }}
            disabled={ingredients.length === 0 || isLoading}
            className="w-full py-2.5 bg-green-600/90 hover:bg-green-700 disabled:bg-gray-300/70 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-colors text-sm flex items-center justify-center gap-2 shadow-md"
          >
            <Wallet className="w-4 h-4" />
            {t('button.economicRecipe', 'Receta económica')}
          </button>
        </div>

        {/* Ad Banner — debajo del botón generar */}
        <div className="relative z-10">
          <AdBanner variant="horizontal" t={t} />
        </div>

        {showHistory && (
          <Suspense
            fallback={
              <div className="fixed inset-0 z-50 bg-black/20 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
              </div>
            }
          >
            <HistoryPanel
              history={history}
              onSelect={(entry) => {
                setRecipe(entry.recipe);
                setShowHistory(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
                analytics.track('history_select', { source: entry.source });
              }}
              onClear={() => {
                clearHistory();
                analytics.track('history_clear');
              }}
              onRemove={(id) => {
                removeFromHistory(id);
                analytics.track('history_remove');
              }}
              onClose={() => {
                setShowHistory(false);
              }}
              onExportJSON={() => {
                analytics.track('history_export', { format: 'json' });
                return exportToJSON();
              }}
              onExportCSV={() => {
                analytics.track('history_export', { format: 'csv' });
                return exportToCSV();
              }}
              t={t}
              lang={lang}
            />
          </Suspense>
        )}

        {/* Scroll indicator cuando la receta está lista */}
        <ScrollIndicator visible={!!recipe && !isLoading} t={t} />

        {/* Recipe Result */}
        {recipe && !isLoading && (
          <div className="relative z-10 mt-6 sm:mt-8">
            <div className="max-w-2xl mx-auto flex items-center justify-between mb-3">
              <ShareButton recipe={recipe} t={t} />
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
            <RecipeCard recipe={recipe} onGenerateVariation={handleGenerateVariation} t={t} />
            <AffiliateLinks recipeCategory={recipe.category ?? recipe.title.split(' ')[0]} t={t} />
            <AdBanner variant="horizontal" t={t} />
          </div>
        )}

        {/* Preferences Modal */}
        {showPrefs && (
          <Suspense
            fallback={
              <div className="fixed inset-0 z-50 bg-black/20 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
              </div>
            }
          >
            <PreferencesPanel
              preferences={preferences}
              onChange={setPreferences}
              onClose={() => {
                setShowPrefs(false);
              }}
              t={t}
            />
          </Suspense>
        )}

        <footer className="relative z-10 mt-12 sm:mt-16 text-center text-gray-400 text-xs sm:text-sm px-4 pb-8">
          <p>
            {t('app.footerBrand', 'EsLoQueHay © 2026')} —{' '}
            {t('footer.motto', 'Creamos momentos, no solo comidas')}
          </p>
          <p className="text-[10px] text-gray-300 mt-1">
            {t('footer.tagline', 'Hecho con curiosidad y hambre de crear')}
          </p>
        </footer>
      </div>
    </ErrorBoundary>
  );
}

export default App;
