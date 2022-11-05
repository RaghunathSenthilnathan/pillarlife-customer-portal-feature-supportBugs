import {Auth} from '@aws-amplify/auth';
import { useAsync } from '@hooks/use-async';
import { useRef } from 'react';
import { useForm } from 'react-hook-form';
import { TEMP_PWD_LOCALSTORAGE_KEY } from 'src/constants';
export function useRegister() {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const { register, handleSubmit, watch, reset, errors: formErrors, } = useForm();
    const passwordRef = useRef('');
    passwordRef.current = watch('password', '');
    const { error, status, isLoading, isSuccess, isError, run, } = useAsync();
    const onSubmit = async ({ email, referralCode, 
    // familyName,
    password, }) => {
        await run(handleRegister());

        
        async function handleRegister() {
            const result = await Auth.signUp({
                username: email.trim(),
                password,
                attributes: {
                    'custom:referral_code': referralCode?.trim(),
                    // family_name: familyName?.trim(),
                },
            });
            localStorage.setItem(TEMP_PWD_LOCALSTORAGE_KEY, password);
            reset();
            return result;
        }
    };
    return {
        handleSubmit: handleSubmit(onSubmit),
        register,
        formErrors,
        passwordRef,
        isError,
        error,
        status,
        isSuccess,
        isLoading,
    };
}
