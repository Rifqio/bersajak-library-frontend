import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-[50vh] items-center justify-center">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-red-600 mb-4 font-poppins">
              Error 500
            </h1>
            <p className="text-xl text-gray-800 font-thin mb-4">
              Terjadi kesalahan, silahkan coba beberapa saat lagi.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
