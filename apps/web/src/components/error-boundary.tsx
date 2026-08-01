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
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#0F172A] p-4">
          <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-8 text-center flex flex-col items-center">
            <div className="h-16 w-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-6">
              <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-500" />
            </div>
            
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              Something went wrong
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mb-8">
              An unexpected error occurred in FloodGuard AI.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full mb-6">
              <button
                onClick={this.handleReset}
                className="flex-1 flex items-center justify-center gap-2 bg-[#1E3A5F] hover:bg-[#152a46] text-white px-4 py-2.5 rounded-lg transition-colors font-medium"
              >
                <RefreshCw className="h-4 w-4" />
                Try Again
              </button>
              <button
                onClick={this.handleGoHome}
                className="flex-1 flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white px-4 py-2.5 rounded-lg transition-colors font-medium"
              >
                <Home className="h-4 w-4" />
                Go Home
              </button>
            </div>

            {import.meta.env.DEV && this.state.error && (
              <div className="w-full text-left">
                <button 
                  onClick={() => this.setState(prev => ({ isDetailsOpen: !prev.isDetailsOpen }))}
                  className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
                >
                  {this.state.isDetailsOpen ? 'Hide' : 'Show'} error details
                </button>
                
                {this.state.isDetailsOpen && (
                  <div className="mt-4 p-4 bg-slate-100 dark:bg-slate-950 rounded-lg overflow-auto max-h-48 text-xs font-mono text-slate-800 dark:text-slate-300">
                    <p className="font-bold mb-2 text-red-600 dark:text-red-400">{this.state.error.toString()}</p>
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
