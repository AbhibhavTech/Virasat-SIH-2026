import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Compass } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[Virasat ErrorBoundary caught exception]:', error, errorInfo);
  }

  private handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[50vh] flex items-center justify-center p-6 bg-[#FAF8F5]">
          <div className="max-w-md w-full rounded-3xl bg-white border border-[#EFE8DF] p-8 shadow-sm text-center space-y-5">
            <div className="w-14 h-14 rounded-2xl bg-orange-50 border border-orange-200 text-[#FF671F] flex items-center justify-center mx-auto shadow-2xs">
              <Compass className="w-7 h-7 text-[#FF671F]" />
            </div>

            <div className="space-y-2">
              <h2 className="font-serif text-xl font-bold text-stone-900">
                Experience Recovered
              </h2>
              <p className="text-xs text-stone-600 leading-relaxed">
                Virasat encountered an unexpected rendering condition. The platform state has been preserved safely.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={this.handleReset}
                className="px-4 py-2 rounded-full bg-[#FF671F] hover:bg-[#E65100] text-white text-xs font-bold transition shadow-xs cursor-pointer active:scale-95"
              >
                Continue Exploring
              </button>
              <button
                type="button"
                onClick={this.handleReload}
                className="px-4 py-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold border border-stone-200 transition flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reload</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
