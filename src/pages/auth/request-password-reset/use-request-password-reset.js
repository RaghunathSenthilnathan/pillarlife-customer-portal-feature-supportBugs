import {Auth} from '@aws-amplify/auth';
import { useAsync } from '@hooks/use-async';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
export function useRequestPasswordReset() {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const { register, handleSubmit, reset, errors: formErrors, } = useForm();
    const { error, status, isLoading, isSuccess, isError, run } = useAsync();
    const onSubmit = ({ email }) => {
        run(requestPasswordReset());
        function requestPasswordReset() {
            return Auth.forgotPassword(email);
        }
    };
    useEffect(() => {
        if (isSuccess) {
            reset();
        }
    }, [isSuccess, reset]);
    return {
        register,
        handleSubmit: handleSubmit(onSubmit),
        formErrors,
        isError,
        error,
        isSuccess,
        isLoading,
        status,
    };
}
//# sourceMappingURL=use-request-password-reset.js.map