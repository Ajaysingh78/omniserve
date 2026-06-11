import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 40, background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 10, textAlign: "center", color: "var(--text)", margin: 20 }}>
          <h2 style={{ fontSize: 18, color: "var(--red)", marginBottom: 12 }}>Something went wrong</h2>
          <p style={{ fontSize: 13, color: "var(--text2)", marginBottom: 16 }}>
            The application encountered an unexpected error. Please refresh the page or contact support.
          </p>
          <button 
            className="btn primary" 
            onClick={() => window.location.reload()}
            style={{ padding: "8px 16px" }}
          >
            Reload Application
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
