import { Component } from "react";
import type { ReactNode, ErrorInfo } from "react";

interface Props {
  remoteName: string;
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class RemoteErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(
      `[MFE:${this.props.remoteName}] Error loading remote:`,
      error,
      errorInfo
    );
    // In production: send to Sentry/Datadog
    // reportError({ remote: this.props.remoteName, error, errorInfo });
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="remote-error">
          <div className="remote-error__icon">⚠️</div>
          <h2 className="remote-error__title">
            Módulo "{this.props.remoteName}" no disponible
          </h2>
          <p className="remote-error__message">
            {this.state.error?.message || "Error desconocido al cargar el módulo remoto."}
          </p>
          <button className="btn btn--primary btn--md" onClick={this.handleRetry}>
            🔄 Reintentar
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
