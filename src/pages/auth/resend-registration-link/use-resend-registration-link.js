import {Auth} from '@aws-amplify/auth';
import { useAsync } from '@hooks/use-async';
import { useForm } from 'react-hook-form';
export function useResendRegistrationLink() {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const { register, handleSubmit, reset, errors: formErrors, } = useForm();
    const { status, error, isLoading, isSuccess, isError, run } = useAsync();
    const onSubmit = async ({ email }) => {
        await run(Auth.resendSignUp(email));
        reset();
    };
    return {
        handleSubmit: handleSubmit(onSubmit),
        register,
        formErrors,
        isError,
        error,
        isSuccess,
        isLoading,
        status,
    };
}
