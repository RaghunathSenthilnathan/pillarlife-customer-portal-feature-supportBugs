import {Auth} from '@aws-amplify/auth';
import { useAsync } from '@hooks/use-async';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
export function useChangeEmail({ userConfig, closeEmailModal, }) {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const { register, handleSubmit, reset, errors: formErrors, } = useForm();
    const { error, status, isLoading, isSuccess, isError, run } = useAsync();
    const onSubmit = ({ email }) => {
        run(initiateEmailChange());
        function initiateEmailChange() {
            return Auth.updateUserAttributes(userConfig, {
                email,
            });
        }
    };
    useEffect(() => {
        if (isSuccess) {
            reset();
            closeEmailModal();
        }
    }, [closeEmailModal, isSuccess, reset]);
    return {
        register,
        handleSubmit: handleSubmit(onSubmit),
        formErrors,
        error,
        status,
        isLoading,
        isSuccess,
        isError,
    };
}
