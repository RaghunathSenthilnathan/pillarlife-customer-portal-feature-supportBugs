import {Auth} from '@aws-amplify/auth';
import { useAuth } from '@context/auth';
import { useAsync } from '@hooks/use-async';
import router from 'next/router';
import { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
export function useChangePassword({ userConfig, closePasswordModal, }) {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const { register, handleSubmit, watch, reset, errors: formErrors, } = useForm();
    const newPasswordRef = useRef('');
    const { dispatch } = useAuth();
    newPasswordRef.current = watch('newPassword', '');
    const { status, error, isError, isLoading, isSuccess, run } = useAsync();
    const onSubmit = ({ oldPassword, newPassword }) => {
        run(changePassword());
        function changePassword() {
            return Auth.changePassword(userConfig, oldPassword, newPassword);
        }
    };
    useEffect(async() => {
        if(isSuccess) {
            reset();
            closePasswordModal();
            await Auth.signOut();
            dispatch({ type: 'LOGOUT_SUCCESS' });
            localStorage.clear();
            router.push('/auth/login');
        }
    }, [closePasswordModal, isSuccess,reset]);
    return {
        register,
        handleSubmit: handleSubmit(onSubmit),
        formErrors,
        status,
        error,
        isError,
        isLoading,
        isSuccess,
        newPasswordRef,
    };
}
