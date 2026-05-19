import { useState } from 'react';
import {
  Globe,
  Flame,
  ChefHat,
  Users,
  Clock,
  Zap,
  X,
  Settings2,
  Wallet,
  Languages,
} from 'lucide-react';
import type { UserPreferences } from '../types/preferences';
import {
  COUNTRY_LABELS,
  FLAVOR_LABELS,
  BUDGET_LABELS,
  DEFAULT_PREFERENCES,
} from '../types/preferences';
import { LANGUAGE_NAMES, type LanguageCode } from '../i18n';

interface PreferencesPanelProps {
  preferences: UserPreferences;
  onChange: (prefs: UserPreferences) => void;
  onClose: () => void;
}

function formatTime(minutes: number): string {
  if (minutes < 60) return `${String(minutes)} min`;
  if (minutes < 1440) {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return m > 0 ? `${String(h)}h ${String(m)}m` : `${String(h)}h`;
  }
  const d = Math.floor(minutes / 1440);
  const h = Math.floor((minutes % 1440) / 60);
  return h > 0 ? `${String(d)}d ${String(h)}h` : `${String(d)}d`;
}

export default function PreferencesPanel({
  preferences,
  onChange,
  onClose,
}: PreferencesPanelProps) {
  const [local, setLocal] = useState<UserPreferences>(preferences);

  const update = <K extends keyof UserPreferences>(key: K, value: UserPreferences[K]) => {
    const next = { ...local, [key]: value };
    setLocal(next);
    onChange(next);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-0 sm:p-4">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full max-w-md max-h-[85vh] sm:max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Settings2 className="w-5 h-5 text-brand-600" />
            <h2 className="text-lg font-bold text-gray-900">Tus Preferencias</h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* País */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Globe className="w-4 h-4 text-brand-500" />
              País de origen
            </label>
            <select
              value={local.country}
              onChange={(e) => {
                update('country', e.target.value as UserPreferences['country']);
              }}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
            >
              {Object.entries(COUNTRY_LABELS).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-400 mt-1">Adaptamos ingredientes y términos locales</p>
          </div>

          {/* Idioma */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Languages className="w-4 h-4 text-brand-500" />
              Idioma
            </label>
            <select
              value={local.language}
              onChange={(e) => {
                update('language', e.target.value as LanguageCode);
              }}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
            >
              {Object.entries(LANGUAGE_NAMES).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          {/* Tipo de sabor */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Flame className="w-4 h-4 text-brand-500" />
              Perfil de sabor preferido
            </label>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(FLAVOR_LABELS).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => {
                    update('flavorProfile', key as UserPreferences['flavorProfile']);
                  }}
                  className={`px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                    local.flavorProfile === key
                      ? 'bg-brand-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Ingrediente adicional */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <ChefHat className="w-4 h-4 text-brand-500" />
              Ingrediente que siempre tenés
            </label>
            <input
              type="text"
              value={local.additionalIngredient}
              onChange={(e) => {
                update('additionalIngredient', e.target.value);
              }}
              placeholder="Ej: huevos, ajo, aceite de oliva..."
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
            />
            <p className="text-xs text-gray-400 mt-1">Lo incluiremos siempre en las recetas</p>
          </div>

          {/* Nivel de habilidad */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <ChefHat className="w-4 h-4 text-brand-500" />
              Nivel de cocina
            </label>
            <div className="flex gap-2">
              {[
                { key: 'beginner' as const, label: 'Principiante' },
                { key: 'intermediate' as const, label: 'Intermedio' },
                { key: 'advanced' as const, label: 'Avanzado' },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => {
                    update('skillLevel', key);
                  }}
                  className={`flex-1 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                    local.skillLevel === key
                      ? 'bg-brand-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Presupuesto */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Wallet className="w-4 h-4 text-brand-500" />
              Presupuesto
            </label>
            <div className="flex gap-2">
              {(
                [
                  { key: 'low' as const, label: BUDGET_LABELS.low },
                  { key: 'medium' as const, label: BUDGET_LABELS.medium },
                  { key: 'high' as const, label: BUDGET_LABELS.high },
                ] as const
              ).map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => {
                    update('budget', key);
                  }}
                  className={`flex-1 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                    local.budget === key
                      ? 'bg-brand-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Comensales */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Users className="w-4 h-4 text-brand-500" />
              Comensales: {local.servings}
            </label>
            <input
              type="range"
              min={1}
              max={10}
              value={local.servings}
              onChange={(e) => {
                update('servings', parseInt(e.target.value));
              }}
              className="w-full accent-brand-600"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>1</span>
              <span>5</span>
              <span>10</span>
            </div>
          </div>

          {/* Velocidad de partículas */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Zap className="w-4 h-4 text-brand-500" />
              Energía de los ingredientes: {local.particleSpeed.toFixed(1)}x
            </label>
            <input
              type="range"
              min={0.2}
              max={3.0}
              step={0.1}
              value={local.particleSpeed}
              onChange={(e) => {
                update('particleSpeed', parseFloat(e.target.value));
              }}
              className="w-full accent-brand-600"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>Lento</span>
              <span>Normal</span>
              <span>Caótico</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Controlá qué tan rápido chocan y se mueven los ingredientes
            </p>
          </div>

          {/* Tiempo máximo — ahora hasta 2 días */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Clock className="w-4 h-4 text-brand-500" />
              Tiempo máximo: {formatTime(local.maxPrepTime)}
            </label>
            <input
              type="range"
              min={5}
              max={2880}
              step={5}
              value={local.maxPrepTime}
              onChange={(e) => {
                update('maxPrepTime', parseInt(e.target.value));
              }}
              className="w-full accent-brand-600"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>5 min</span>
              <span>1 día</span>
              <span>2 días</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Los estofados y guisos lentos valen la pena
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
          <button
            onClick={() => {
              setLocal(DEFAULT_PREFERENCES);
              onChange(DEFAULT_PREFERENCES);
            }}
            className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Restaurar
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 bg-brand-600 text-white rounded-xl text-sm font-medium hover:bg-brand-700 transition-colors"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
