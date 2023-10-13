import React, { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state to indicate an error has occurred
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // You can log the error here or perform other actions
    console.error(error, info);
  }

  render() {
    if (this.state.hasError) {
      // You can customize the error message or UI here
      return <div>Something went wrong. Please refresh the page or try again later.</div>;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
