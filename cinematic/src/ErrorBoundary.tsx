import React from 'react';

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <div className="fixed inset-0 bg-[#050505] flex flex-col items-center justify-center gap-4 z-[9999] p-8">
          <div className="w-16 h-16 rounded-full border-2 border-red-500/30 flex items-center justify-center">
            <span className="text-red-400 text-2xl font-light">!</span>
          </div>
          <p className="text-white/50 text-sm tracking-widest uppercase text-center">
            Something went wrong
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="mt-4 px-6 py-2 rounded-full bg-white/10 border border-white/20 text-white/60 text-xs tracking-widest uppercase hover:bg-white/20 transition-colors"
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
