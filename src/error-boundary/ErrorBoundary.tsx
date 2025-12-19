import { Component, ErrorInfo, ReactNode } from "react";
import { i18n } from "../utils/i18n";

interface Props {
  children: ReactNode;
  fallback: ReactNode;
}
interface State {
  hasError: boolean;
}

export class InsightErrorBoundary extends Component<Props, State> {
  public state: State = { hasError: false };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(i18n.sdkVisualizationCrash, error, errorInfo);
  }

  public render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}
