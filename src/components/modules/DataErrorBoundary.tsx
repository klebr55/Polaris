"use client";

import { Component, type ReactNode } from "react";

interface DataErrorBoundaryProps {
  children: ReactNode;
  fallback: ReactNode;
}

interface DataErrorBoundaryState {
  hasError: boolean;
}

export default class DataErrorBoundary extends Component<
  DataErrorBoundaryProps,
  DataErrorBoundaryState
> {
  constructor(props: DataErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): DataErrorBoundaryState {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}
