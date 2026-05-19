import {
  Clock,
  ChefHat,
  Users,
  Flame,
  Sparkles,
  Wine,
  Palette,
  ArrowRight,
  Wand2,
} from 'lucide-react';
import type { Recipe } from '../types/recipe';

interface RecipeCardProps {
  recipe: Recipe;
  onGenerateVariation?: (variationName: string, extraIngredients: string[]) => void;
}

export default function RecipeCard({ recipe, onGenerateVariation }: RecipeCardProps) {
  const difficultyColor = {
    Fácil: 'bg-green-100 text-green-700',
    Medio: 'bg-yellow-100 text-yellow-700',
    Difícil: 'bg-red-100 text-red-700',
  };

  const totalTime = recipe.prepTime + recipe.cookTime;
  const timeText =
    totalTime >= 1440
      ? `${String(Math.floor(totalTime / 1440))}d ${String(Math.floor((totalTime % 1440) / 60))}h`
      : totalTime >= 60
        ? `${String(Math.floor(totalTime / 60))}h ${String(totalTime % 60)}m`
        : `${String(totalTime)} min`;

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Main Recipe Card */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="bg-brand-600 px-4 sm:px-6 py-4 sm:py-5">
          <h2 className="text-xl sm:text-2xl font-bold text-white">{recipe.title}</h2>
          <p className="text-brand-100 mt-1 text-sm sm:text-base">{recipe.description}</p>
          {recipe.experience && (
            <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 rounded-full text-xs text-white font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              {recipe.experience}
            </div>
          )}
        </div>

        <div className="p-4 sm:p-6">
          {/* Meta info */}
          <div className="flex flex-wrap gap-3 mb-6">
            <span
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${difficultyColor[recipe.difficulty]}`}
            >
              <Flame className="w-3.5 h-3.5" />
              {recipe.difficulty}
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
              <Clock className="w-3.5 h-3.5" />
              {timeText}
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
              <Users className="w-3.5 h-3.5" />
              {recipe.servings} personas
            </span>
          </div>

          {/* Ingredients */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3 flex items-center gap-2">
              <ChefHat className="w-4 h-4 text-brand-600" />
              Ingredientes
            </h3>
            <ul className="space-y-1.5">
              {recipe.ingredients.map((ing, i) => (
                <li key={i} className="flex items-start gap-2 text-gray-700">
                  <span className="w-1.5 h-1.5 bg-brand-400 rounded-full mt-2 flex-shrink-0" />
                  {ing}
                </li>
              ))}
            </ul>
          </div>

          {/* Steps */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">
              Preparación
            </h3>
            <ol className="space-y-4">
              {recipe.steps.map((step, i) => (
                <li key={i} className="flex gap-3">
                  <span className="flex-shrink-0 w-7 h-7 bg-brand-100 text-brand-700 rounded-full flex items-center justify-center text-sm font-semibold">
                    {i + 1}
                  </span>
                  <p className="text-gray-700 pt-0.5">{step}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>

      {/* Gourmet Tips — THE PREMIUM FEATURE */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="bg-amber-50 px-4 sm:px-6 py-3 sm:py-4 border-b border-amber-100">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-600" />
            <h3 className="text-lg font-bold text-amber-900">Versión Gourmet</h3>
          </div>
          <p className="text-amber-700 text-sm mt-1">
            Consejos profesionales para elevar este plato a restaurante
          </p>
        </div>
        <div className="p-4 sm:p-6 space-y-4">
          {recipe.gourmetTips.map((tip, i) => (
            <div key={i} className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center text-xs font-bold">
                {i + 1}
              </span>
              <div>
                <h4 className="font-semibold text-gray-900 text-sm">{tip.title}</h4>
                <p className="text-gray-600 text-sm mt-0.5">{tip.description}</p>
                {tip.technique && (
                  <code className="inline-block mt-1.5 px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs font-mono">
                    {tip.technique}
                  </code>
                )}
              </div>
            </div>
          ))}

          {recipe.platingTip && (
            <div className="mt-4 pt-4 border-t border-gray-100 flex gap-3">
              <Palette className="w-5 h-5 text-amber-500 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-gray-900 text-sm">Emplatado</h4>
                <p className="text-gray-600 text-sm mt-0.5">{recipe.platingTip}</p>
              </div>
            </div>
          )}

          {recipe.winePairing && (
            <div className="mt-4 pt-4 border-t border-gray-100 flex gap-3">
              <Wine className="w-5 h-5 text-amber-500 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-gray-900 text-sm">Maridaje</h4>
                <p className="text-gray-600 text-sm mt-0.5">{recipe.winePairing}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Variations — THE EXPERIENCE */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="bg-brand-50 px-4 sm:px-6 py-3 sm:py-4 border-b border-brand-100">
          <div className="flex items-center gap-2">
            <ArrowRight className="w-5 h-5 text-brand-600" />
            <h3 className="text-lg font-bold text-brand-900">Otras Experiencias</h3>
          </div>
          <p className="text-brand-700 text-sm mt-1">
            Los mismos ingredientes, un resultado completamente diferente. Tocá para generar.
          </p>
        </div>
        <div className="p-4 sm:p-6 space-y-4">
          {recipe.variations.map((variation, i) => (
            <button
              key={i}
              onClick={() => onGenerateVariation?.(variation.name, variation.extraIngredients)}
              className="w-full text-left border border-gray-100 rounded-xl p-3 sm:p-4 hover:border-brand-300 hover:shadow-md hover:bg-brand-50/30 transition-all active:scale-[0.99]"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-gray-900">{variation.name}</h4>
                    <Wand2 className="w-3.5 h-3.5 text-brand-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <p className="text-gray-600 text-sm mt-1">{variation.description}</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {variation.extraIngredients.map((ing, j) => (
                      <span
                        key={j}
                        className="inline-block px-2 py-0.5 bg-brand-50 text-brand-700 rounded text-xs font-medium"
                      >
                        + {ing}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex-shrink-0 text-right">
                  <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-medium">
                    {variation.twist}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
