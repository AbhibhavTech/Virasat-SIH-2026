import React, { Component, ErrorInfo, ReactNode } from 'react';
import { MapPin, RotateCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
  height?: string;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class MapErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[MapErrorBoundary] Caught map rendering exception:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div
          className="w-full rounded-2xl border border-stone-200 bg-stone-50 flex flex-col items-center justify-center p-8 text-center space-y-4 shadow-sm"
          style={{ height: this.props.height || '420px' }}
        >
          <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-800 shadow-xs">
            <MapPin className="w-6 h-6" />
          </div>
          <div className="max-w-md space-y-1">
            <h3 className="font-serif font-bold text-base text-stone-900">Map View Recovery</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              The interactive map encountered an initialization issue. Click below to reload the viewport with default pan coordinates.
            </p>
          </div>
          <button
            onClick={this.handleReset}
            className="px-4 py-2 bg-amber-800 hover:bg-amber-900 text-white text-xs font-semibold rounded-xl flex items-center gap-2 transition-colors shadow-xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reload Map View
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
