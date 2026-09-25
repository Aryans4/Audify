import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Audify Caught Error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleReset = () => {
    try {
      localStorage.clear();
    } catch {}
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            width: '100vw',
            background: '#0a0a0a',
            color: '#ffffff',
            fontFamily: 'system-ui, sans-serif',
            padding: '20px',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              padding: '30px',
              borderRadius: '16px',
              background: '#141414',
              border: '1px solid rgba(255,255,255,0.1)',
              maxWidth: '520px',
            }}
          >
            <div style={{ fontSize: '3rem', marginBottom: '15px' }}>🎵</div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>Audify Audio Player</h2>
            <p style={{ color: '#a1a1aa', fontSize: '0.9rem', marginBottom: '20px' }}>
              Something interrupted the view. Click below to continue your listening session.
            </p>
            {this.state.error && (
              <pre
                style={{
                  background: '#000',
                  color: '#f87171',
                  padding: '10px',
                  borderRadius: '8px',
                  fontSize: '0.75rem',
                  textAlign: 'left',
                  overflowX: 'auto',
                  marginBottom: '20px',
                  maxHeight: '120px',
                }}
              >
                {this.state.error?.toString()}
              </pre>
            )}
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button
                onClick={this.handleReload}
                style={{
                  padding: '10px 20px',
                  borderRadius: '9999px',
                  background: '#ffffff',
                  color: '#000000',
                  border: 'none',
                  fontWeight: '700',
                  cursor: 'pointer',
                }}
              >
                Reload App
              </button>
              <button
                onClick={this.handleReset}
                style={{
                  padding: '10px 20px',
                  borderRadius: '9999px',
                  background: 'rgba(255,255,255,0.1)',
                  color: '#ffffff',
                  border: '1px solid rgba(255,255,255,0.2)',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
              >
                Clear Cache & Reset
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
