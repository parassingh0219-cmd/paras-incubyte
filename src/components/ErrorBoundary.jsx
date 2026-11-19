import React from 'react';
import { Button, Result } from 'antd';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[Error Boundary caught exception]', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            background: 'var(--color-bg)',
            color: 'var(--color-text)',
            padding: '2rem',
          }}
        >
          <Result
            status="500"
            title="System Error Encountered"
            subTitle="The Enterprise Salary Management System encountered an unexpected runtime exception."
            extra={
              <Button type="primary" onClick={this.handleReset}>
                Reload Application
              </Button>
            }
          />
        </div>
      );
    }

    return this.props.children;
  }
}
