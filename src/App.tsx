import { useState, useMemo, useCallback, useEffect, lazy, Suspense } from 'react';
import { ConsentBanner } from './components/ConsentBanner';
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
import { useConsent } from './hooks/useConsent';
import { useRecipeGenerator } from './hooks/useRecipeGenerator';
import { useAppInit } from './hooks/useAppInit';
import { getRandomPhrase } from './data/phrases';
import { analytics } from './services/analytics';
import { updateConsent } from './services/ga4';
import { loadAdSense } from './services/adsense';
import type { UserPreferences, Country } from './types/preferences';
import { DEFAULT_PREFERENCES } from './types/preferences';
import { userPreferencesSchema } from './types/schemas';
import { useI18n, LANGUAGE_NAMES, LANGUAGE_FLAGS, type LanguageCode } from './i18n';

const HistoryPanel = lazy(() => import('./components/HistoryPanel'));
const PreferencesPanel = lazy(() => import('./components/PreferencesPanel'));

function App() {
  const [showPrefs, setShowPrefs] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const { history, addToHistory, clearHistory, removeFromHistory, exportToJSON, exportToCSV } =
    useHistory();
  const { toasts, addToast, removeToast } = useToast();
  const isOnline = useOnlineStatus();
  const visitCount = useVisitCounter();
  const { consent, saveConsent } = useConsent();

  const resetConsent = useCallback(() => {
    saveConsent('pending');
  }, [saveConsent]);

  // Initialize or update GA4 and AdSense based on consent
  useEffect(() => {
    if (consent === 'granted') {
      updateConsent('granted');
      loadAdSense();
    } else if (consent === 'denied') {
      updateConsent('denied');
    }
  }, [consent]);

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

  const { sessionId, backendReady } = useAppInit(preferences.language);

  // React to language preference changes
  useEffect(() => {
    if (lang !== preferences.language) {
      void switchLanguage(preferences.language);
    }
  }, [preferences.language, lang, switchLanguage]);

  // Clear persisted ingredients from previous sessions
  useEffect(() => {
    localStorage.removeItem('esloquehay-ingredients');
  }, []);

  const { recipe, isLoading, setRecipe, handleGenerate, handleGenerateVariation } =
    useRecipeGenerator({
      ingredients,
      recipeCountry,
      preferences,
      sessionId,
      backendReady,
      isOnline,
      addToast,
      t,
      addToHistory,
    });

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

  const handleGenerateVariationWithIngredients = useCallback(
    (variationName: string, extraIngredients: string[]) => {
      extraIngredients.forEach((ing) => {
        addIngredient(ing.toLowerCase());
      });
      handleGenerateVariation(variationName, extraIngredients);
    },
    [addIngredient, handleGenerateVariation]
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
        {/* Logo de fondo */}
        <div className="fixed inset-0 pointer-events-none z-0 logo-bg opacity-50" />
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
            {/* Language selector */}
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

        {/* Floating Ingredients Cloud */}
        <div className="relative z-10 max-w-2xl mx-auto py-4 px-2 bg-white/15 ingredient-cloud cloud-backdrop">
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

        {/* Ad Banner */}
        <div className="relative z-10">
          <AdBanner
            variant="horizontal"
            t={t}
            adSlot={import.meta.env.VITE_ADSENSE_SLOT_TOP as string | undefined}
          />
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

        {/* Scroll indicator */}
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
            <RecipeCard
              recipe={recipe}
              onGenerateVariation={handleGenerateVariationWithIngredients}
              t={t}
            />
            <AffiliateLinks recipeCategory={recipe.category ?? recipe.title.split(' ')[0]} t={t} />
            <AdBanner
              variant="horizontal"
              t={t}
              adSlot={import.meta.env.VITE_ADSENSE_SLOT_BOTTOM as string | undefined}
            />
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
          <div className="flex items-center justify-center gap-3 mt-3 text-[10px] text-gray-300">
            <a href="/terms-of-service.html" className="hover:text-brand-500 transition-colors">
              Términos
            </a>
            <span>·</span>
            <a href="/privacy-policy.html" className="hover:text-brand-500 transition-colors">
              Privacidad
            </a>
            <span>·</span>
            <a href="/cookies-policy.html" className="hover:text-brand-500 transition-colors">
              Cookies
            </a>
            <span>·</span>
            <a
              href="/nutritional-disclaimer.html"
              className="hover:text-brand-500 transition-colors"
            >
              Disclaimer
            </a>
            <span>·</span>
            <button
              onClick={resetConsent}
              className="hover:text-brand-500 transition-colors underline underline-offset-2"
            >
              {t('footer.manageConsent', 'Preferencias de privacidad')}
            </button>
          </div>
        </footer>

        <ConsentBanner consent={consent} onConsent={saveConsent} t={t} />
      </div>
    </ErrorBoundary>
  );
}

export default App;
