import { Component } from 'react';
export class TopLevelErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.onUnhandledRejection = (event) => {
            event.promise.catch(error => {
                this.setState(TopLevelErrorBoundary.getDerivedStateFromError(error));
            });
        };
        this.state = { hasError: false };
    }
    static getDerivedStateFromError(error) {
        console.log('GetDerivedStateFromError:', error);
        return { hasError: true };
    }
    componentDidMount() {
        window.addEventListener('unhandledrejection', this.onUnhandledRejection);
    }
    componentDidCatch(error, errorInfo) {
        console.log('Unexpected error occurred!', error, errorInfo);
    }
    componentWillUnmount() {
        window.removeEventListener('unhandledrejection', this.onUnhandledRejection);
    }
    render() {
        const { hasError } = this.state;
        const { children } = this.props;
        if (hasError) {
            return (<h1 className="text-2xl">
          An error has occurred
          <span role="img" aria-label="cross">
            ❌️❌️❌️
          </span>
        </h1>);
        }
        return children;
    }
}
