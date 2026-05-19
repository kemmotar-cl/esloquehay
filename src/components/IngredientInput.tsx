import { useState } from 'react';
import { Plus, X, Sparkles } from 'lucide-react';

import { getRandomLoadingPhrase } from '../data/phrases';
import type { SpanishVariant } from '../data/phrases';

const FUNNY_BUTTON_PHRASES = [
  'Derritete del placer',
  'Preparate para volar',
  'Abrí bien la boca',
  'Esto va a ser épico',
  'Llamá a la familia',
  'Apretá acá, no tengás miedo',
  'Magia en proceso',
  'Transformando lo simple en arte',
  'Tu cena se viene con todo',
  'Hacé espacio en el estómago',
  'Alerta: sabor inminente',
  'Cocina con alma, no con plata',
  'Despertá al chef que llevás dentro',
  'Ingredientes + amor = esto',
  'Ahora sí, se viene lo bueno',
];

interface IngredientInputProps {
  ingredients: string[];
  tagline?: string;
  spanishVariant?: SpanishVariant;
  onAdd: (ingredient: string) => void;
  onRemove: (index: number) => void;
  onGenerate: () => void;
  isLoading: boolean;
}

export default function IngredientInput({
  ingredients,
  tagline,
  onAdd,
  onRemove,
  onGenerate,
  isLoading,
}: IngredientInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [loadingPhrase] = useState(() => getRandomLoadingPhrase());
  const [buttonPhrase] = useState(
    () => FUNNY_BUTTON_PHRASES[Math.floor(Math.random() * FUNNY_BUTTON_PHRASES.length)]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const value = inputValue.trim().toLowerCase();
      if (value) {
        onAdd(value);
        setInputValue('');
      }
    }
  };

  const handleAddClick = () => {
    const value = inputValue.trim().toLowerCase();
    if (value) {
      onAdd(value);
      setInputValue('');
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Tagline */}
      <div className="text-center mb-6 relative z-10">
        <p className="text-gray-700 text-sm sm:text-lg min-h-[1.5rem] sm:min-h-[1.75rem] max-w-md mx-auto px-2 drop-shadow-sm font-medium">
          {tagline ?? 'Abrí la nevera. Nosotros pensamos el resto.'}
        </p>
      </div>

      {/* Input area — transparente, forma de burbuja de pensamiento */}
      <div
        className="relative p-6 mb-4"
        style={{
          background: 'transparent',
          borderRadius: '40% 60% 55% 45% / 55% 45% 55% 45%',
        }}
      >
        {/* Decoración de burbuja de pensamiento */}
        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1 opacity-40">
          <div className="w-3 h-3 rounded-full bg-brand-300" />
          <div className="w-2 h-2 rounded-full bg-brand-200" />
          <div className="w-1.5 h-1.5 rounded-full bg-brand-100" />
        </div>
        <label className="block text-sm font-semibold text-gray-800 mb-2 drop-shadow-sm">
          ¿Qué más tenés?
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Escribe o toca los ingredientes de arriba..."
            className="flex-1 px-4 py-3 bg-white/80 backdrop-blur-sm border border-white/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent shadow-sm"
          />
          <button
            onClick={handleAddClick}
            className="px-4 py-3 bg-white/80 backdrop-blur-sm hover:bg-white rounded-xl transition-colors shadow-sm"
          >
            <Plus className="w-5 h-5 text-gray-700" />
          </button>
        </div>

        {/* Selected tags */}
        {ingredients.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {ingredients.map((ing, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-white/80 backdrop-blur-sm text-brand-700 rounded-full text-sm font-medium shadow-sm"
              >
                {ing}
                <button
                  onClick={() => {
                    onRemove(index);
                  }}
                  className="hover:text-brand-900"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Generate button */}
        <button
          onClick={onGenerate}
          disabled={ingredients.length === 0 || isLoading}
          className="w-full mt-6 py-4 bg-brand-600/90 hover:bg-brand-700 disabled:bg-gray-300/70 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              {loadingPhrase}
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              {buttonPhrase}
            </>
          )}
        </button>
      </div>
    </div>
  );
}
