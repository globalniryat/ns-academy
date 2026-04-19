"use client";

import React from "react";

interface State {
  hasError: boolean;
}

export default class SectionErrorBoundary extends React.Component<
  { children: React.ReactNode; sectionName?: string },
  State
> {
  constructor(props: { children: React.ReactNode; sectionName?: string }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error(`[SectionErrorBoundary] ${this.props.sectionName ?? 'Section'} crashed:`, error);
  }

  render() {
    if (this.state.hasError) {
      // Render nothing — page continues loading other sections
      return null;
    }
    return this.props.children;
  }
}
