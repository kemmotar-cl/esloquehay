import { Share2 } from 'lucide-react';
import type { Recipe } from '../types/recipe';

interface ShareButtonProps {
  recipe: Recipe;
  variant?: 'button' | 'icon';
  t?: (path: string, fallback?: string) => string;
}

export default function ShareButton({ recipe, variant = 'button', t }: ShareButtonProps) {
  const difficultyLabel =
    t?.(`difficulty.${recipe.difficulty}`, recipe.difficulty) ?? recipe.difficulty;
  const servingsLabel = t?.('share.servingsLabel', 'personas') ?? 'personas';
  const generatedWith =
    t?.('share.generatedWith', 'Generado con EsLoQueHay ✨') ?? 'Generado con EsLoQueHay ✨';
  const shareText = `🍳 ${recipe.title}\n\n${recipe.description}\n\n⏱️ ${String(recipe.prepTime + recipe.cookTime)} min | 👥 ${String(recipe.servings)} ${servingsLabel} | 🔥 ${difficultyLabel}\n\n${generatedWith}`;

  const handleShare = async () => {
    if (typeof navigator.share === 'function') {
      try {
        await navigator.share({
          title: recipe.title,
          text: shareText,
          url: 'https://esloquehay.app',
        });
        return;
      } catch {
        // User cancelled or error, fall through
      }
    }

    // Fallback: WhatsApp
    const waUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
    window.open(waUrl, '_blank');
  };

  if (variant === 'icon') {
    return (
      <button
        onClick={() => void handleShare()}
        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        title={t?.('button.share', 'Compartir') ?? 'Compartir'}
      >
        <Share2 className="w-4 h-4 text-gray-500" />
      </button>
    );
  }

  return (
    <button
      onClick={() => void handleShare()}
      className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors"
    >
      <Share2 className="w-4 h-4" />
      {t?.('button.share', 'Compartir') ?? 'Compartir'}
    </button>
  );
}
