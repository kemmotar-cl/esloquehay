/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface ScrollIndicatorProps {
  visible: boolean;
}

export default function ScrollIndicator({ visible }: ScrollIndicatorProps) {
  const [dismissed, setDismissed] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!visible) return undefined;

    setDismissed(false);

    const handleScroll = () => {
      if (window.scrollY > 50) {
        setDismissed(true);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    timerRef.current = setTimeout(() => {
      setDismissed(true);
    }, 6000);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [visible]);

  if (!visible || dismissed) return null;

  return (
    <div className="w-full max-w-2xl mx-auto my-4 animate-bounce">
      <button
        onClick={() => {
          window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
          setDismissed(true);
        }}
        className="w-full py-3 bg-brand-50 hover:bg-brand-100 rounded-xl border border-brand-200 text-brand-700 font-medium text-sm flex items-center justify-center gap-2 transition-colors"
      >
        <span>✨ Tu experiencia está lista</span>
        <ChevronDown className="w-4 h-4" />
      </button>
    </div>
  );
}
