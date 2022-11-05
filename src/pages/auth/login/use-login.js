import { useAuth } from '@context/auth';
import { useAsync } from '@hooks/use-async';
import { handleLogin } from '@utils/log-user-in';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
export function useLogin() {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const { register, handleSubmit, errors: formErrors } = useForm();
    const { initializeUser } = useAuth();
    const router = useRouter();
    const { error, status, isLoading, isError, run } = useAsync();
    const onSubmit = ({ email, password }) => {
        run(handleLogin({ email, password, router, initializeUser }));
    };
    return {
        handleSubmit: handleSubmit(onSubmit),
        register,
        formErrors,
        isError,
        error,
        status,
        isLoading,
    };
}
