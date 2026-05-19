import { Share2 } from 'lucide-react';
import type { Recipe } from '../types/recipe';

interface ShareButtonProps {
  recipe: Recipe;
  variant?: 'button' | 'icon';
}

export default function ShareButton({ recipe, variant = 'button' }: ShareButtonProps) {
  const shareText = `🍳 ${recipe.title}\n\n${recipe.description}\n\n⏱️ ${String(recipe.prepTime + recipe.cookTime)} min | 👥 ${String(recipe.servings)} personas | 🔥 ${recipe.difficulty}\n\nGenerado con EsLoQueHay ✨`;

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
        title="Compartir"
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
      Compartir
    </button>
  );
}
