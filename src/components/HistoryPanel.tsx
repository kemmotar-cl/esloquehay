import { X, Clock, Trash2 } from 'lucide-react';
import type { Recipe } from '../types/recipe';

interface HistoryEntry {
  recipe: Recipe;
  timestamp: number;
}

interface HistoryPanelProps {
  history: HistoryEntry[];
  onSelect: (recipe: Recipe) => void;
  onClear: () => void;
  onRemove: (index: number) => void;
  onClose: () => void;
}

function formatDate(ts: number): string {
  const d = new Date(ts);
  return d.toLocaleDateString('es-CL', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function HistoryPanel({
  history,
  onSelect,
  onClear,
  onRemove,
  onClose,
}: HistoryPanelProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-0 sm:p-4">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full max-w-md max-h-[85vh] sm:max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-brand-600" />
            <h2 className="text-lg font-bold text-gray-900">Historial</h2>
          </div>
          <div className="flex items-center gap-2">
            {history.length > 0 && (
              <button
                onClick={onClear}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Limpiar
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="p-4 space-y-3">
          {history.length === 0 ? (
            <div className="text-center py-12">
              <Clock className="w-12 h-12 text-gray-200 mx-auto mb-3" />
              <p className="text-gray-400 text-sm">Todavía no generaste nada</p>
              <p className="text-gray-300 text-xs mt-1">Tus experiencias aparecerán acá</p>
            </div>
          ) : (
            history.map((entry, index) => (
              <button
                key={entry.timestamp}
                onClick={() => {
                  onSelect(entry.recipe);
                }}
                className="w-full text-left border border-gray-100 rounded-xl p-4 hover:border-brand-300 hover:shadow-md hover:bg-brand-50/30 transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-gray-900 truncate">{entry.recipe.title}</h4>
                    <p className="text-gray-500 text-xs mt-0.5 line-clamp-2">
                      {entry.recipe.description}
                    </p>
                    <span className="text-[10px] text-gray-300 mt-1.5 inline-flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDate(entry.timestamp)}
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemove(index);
                    }}
                    className="p-1.5 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                  >
                    <X className="w-3.5 h-3.5 text-gray-300 hover:text-red-500" />
                  </button>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
