import { Component, type ReactNode } from 'react';
import { logger } from '../services/logger';

interface Props {
  children: ReactNode;
  t?: (path: string, fallback?: string) => string;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    logger.error('ErrorBoundary', 'React render error', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
          <div className="text-center max-w-md">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {this.props.t?.('errorBoundary.title', 'Algo salió mal') ?? 'Algo salió mal'}
            </h1>
            <p className="text-gray-600 mb-4">
              {this.props.t?.(
                'errorBoundary.message',
                'Ocurrió un error inesperado. Intenta recargar la página.'
              ) ?? 'Ocurrió un error inesperado. Intenta recargar la página.'}
            </p>
            <button
              onClick={() => {
                window.location.reload();
              }}
              className="px-4 py-2 bg-brand-600 text-white rounded-xl font-medium hover:bg-brand-700 transition-colors"
            >
              {this.props.t?.('errorBoundary.reload', 'Recargar') ?? 'Recargar'}
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
