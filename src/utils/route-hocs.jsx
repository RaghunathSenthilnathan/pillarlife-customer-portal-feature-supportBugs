import { ProgressSpinner } from "primereact/progressspinner";
import { useAuth } from '@context/auth';
import { useRouter } from 'next/router';
import { ROUTE_PATHS } from 'src/constants';
export const withAuthentication = (WrapperComponent) => {
    const AuthCheck = (props) => {
        const { state: { isAuthenticated, isAuthenticating }, } = useAuth();
        const router = useRouter();
        if (isAuthenticating) {
            return  <ProgressSpinner className="fixed top-1/2 right-0  left-0 sm: object-fill" />;
        }
        if (!isAuthenticated) {
            router.push(ROUTE_PATHS.LOGIN);
            return null;
        }
        return <WrapperComponent {...props}/>;
    };
    AuthCheck.displayName = WrapperComponent.displayName;
    return AuthCheck;
};
export const withAnonymous = (WrapperComponent) => {
    const AnonymousCheck = (props) => {
        const { state: { isAuthenticated, isAuthenticating, user }, } = useAuth();
        const router = useRouter();
        if (isAuthenticating) {
            return  <ProgressSpinner className="fixed top-1/2 right-0  left-0 sm: object-fill"/>;
        }
        if (isAuthenticated) {
            router.push('/dashboard');
            return null;
        }
        return <WrapperComponent {...props}/>;
    };
    AnonymousCheck.displayName = WrapperComponent.displayName;
    return AnonymousCheck;
};

