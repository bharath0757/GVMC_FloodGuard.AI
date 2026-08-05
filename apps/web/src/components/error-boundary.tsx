import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  isDetailsOpen: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
    isDetailsOpen: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null, isDetailsOpen: false };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4 dark:bg-[#0F172A]">
          <div className="flex w-full max-w-md flex-col items-center rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-xl dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
              <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-500" />
            </div>

            <h1 className="mb-2 text-2xl font-bold text-slate-900 dark:text-white">
              Something went wrong
            </h1>
            <p className="mb-8 text-slate-500 dark:text-slate-400">
              An unexpected error occurred in FloodGuard AI.
            </p>

            <div className="mb-6 flex w-full flex-col gap-4 sm:flex-row">
              <button
                onClick={this.handleReset}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#1E3A5F] px-4 py-2.5 font-medium text-white transition-colors hover:bg-[#152a46]"
              >
                <RefreshCw className="h-4 w-4" />
                Try Again
              </button>
              <button
                onClick={this.handleGoHome}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-slate-100 px-4 py-2.5 font-medium text-slate-900 transition-colors hover:bg-slate-200 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700"
              >
                <Home className="h-4 w-4" />
                Go Home
              </button>
            </div>

            {import.meta.env.DEV && this.state.error && (
              <div className="w-full text-left">
                <button
                  onClick={() =>
                    this.setState((prev) => ({
                      isDetailsOpen: !prev.isDetailsOpen,
                    }))
                  }
                  className="text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
                >
                  {this.state.isDetailsOpen ? 'Hide' : 'Show'} error details
                </button>

                {this.state.isDetailsOpen && (
                  <div className="mt-4 max-h-48 overflow-auto rounded-lg bg-slate-100 p-4 font-mono text-xs text-slate-800 dark:bg-slate-950 dark:text-slate-300">
                    <p className="mb-2 font-bold text-red-600 dark:text-red-400">
                      {this.state.error.toString()}
                    </p>
                    <pre>{this.state.errorInfo?.componentStack}</pre>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
