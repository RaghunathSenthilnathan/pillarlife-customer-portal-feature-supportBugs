import {Auth} from '@aws-amplify/auth';
import { useAuth } from '@context/auth';
import { useAsync } from '@hooks/use-async';
import { handleLogin } from '@utils/log-user-in';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { ROUTE_PATHS, TEMP_PWD_LOCALSTORAGE_KEY } from 'src/constants';
export function useCompleteRegistration() {
    const { initializeUser } = useAuth();
    const router = useRouter();
    const { error, status, isLoading, isIdle, isError, run } = useAsync();
    useEffect(() => {
        const hasQueryParams = router.query.code && router.query.email;
         console.log(router.isReady,"cess")
         if (router.isReady) { 
        completeRegistration();
        async function completeRegistration() {
            console.log(router.query,"success")
            if (typeof router.query?.email === 'string' &&
                typeof router.query?.code === 'string') {
                    console.log(typeof  router.query?.email,typeof router.query?.code,router.query,"no issue")
                await run(confirmRegistrationAndLogUserIn());
            }
            async function confirmRegistrationAndLogUserIn() {
                await confirmRegistration();
                router.push({pathname: ROUTE_PATHS.WELCOME_BACK,query:{email:router.query.email}},ROUTE_PATHS.WELCOME_BACK)
                //logUserIn();
            }
            function confirmRegistration() {
                return Auth.confirmSignUp(String(router.query.email), String(router.query.code));
            }
         
        }
    }
    }, [router, run, initializeUser,router.isReady]);
    return {
        isError,
        error,
        isLoading,
        isIdle,
        status,
    };
}
