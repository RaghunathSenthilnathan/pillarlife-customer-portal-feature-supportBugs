import {Auth} from '@aws-amplify/auth';
import { useAuth } from '@context/auth';
import { useAsync } from '@hooks/use-async';
import { handleLogin } from '@utils/log-user-in';
import { useRouter } from 'next/router';
import { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { ROUTE_PATHS } from 'src/constants';
export function useWelcomeBack() {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const { register, handleSubmit, watch, setValue, errors: formErrors, } = useForm();
    const { initializeUser } = useAuth();
    const { status, error, isLoading, isError, run } = useAsync();
    const router = useRouter();
    useEffect(() => {
        if (router.isReady) {
                setValue('email', router.query.email);
            }
    }, [router, setValue]);

        const onSubmit = ({ password }) => {
            
            const email = String(router.query.email);
            run(handleLogin({ email, password, router, initializeUser }));
        };
       
    return {
        handleSubmit: handleSubmit(onSubmit),
        register,
        formErrors,
        isLoading,
        isError,
        error,
        status,
    };
}
