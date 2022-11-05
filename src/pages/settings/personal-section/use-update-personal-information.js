import {Auth} from '@aws-amplify/auth';
import { useAsync } from '@hooks/use-async';
import { usePrevious } from '@hooks/use-previous';
import { useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
export function useUpdatePersonalInformation({ user, userConfig, updateUserAttributes, }) {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const { register, handleSubmit, setValue, } = useForm();
    const { error, status, isLoading, isSuccess, isError, run } = useAsync();
    const setFormValues = useCallback(() => {
        setValue('phoneNumber', user?.phoneNumber);
        setValue('country', user?.country);
        setValue('city', user?.city);
        setValue('referralCode', user?.referralCode);
    }, [setValue, user?.referralCode, user?.city, user?.country, user?.phoneNumber]);
    useEffect(() => {
        setFormValues();
    }, [setFormValues]);
    const prevIsError = usePrevious(isError);
    useEffect(() => {
        if (isError && !prevIsError) {
            setFormValues();
        }
    }, [isError, prevIsError, setFormValues]);
    const onSubmit = ({ phoneNumber, referralCode, city, country, }) => {
        run(saveProfileAttributes());
        async function saveProfileAttributes() {
            const phoneNumberWithoutSpaces = phoneNumber || ''.replace(/\s+/g, '');
            const result = await Auth.updateUserAttributes(userConfig, {
                phone_number: phoneNumberWithoutSpaces,
                'custom:country': country || '',
                'custom:city': city || '',
                'custom:referral_code': referralCode || '',
            });
            updateUserAttributes({
                phoneNumber: phoneNumberWithoutSpaces,
                country,
                city,
                referralCode,
            });
            return result;
        }
    };
    return {
        handleSubmit: handleSubmit(onSubmit),
        register,
        isError,
        error,
        isSuccess,
        status,
        isLoading,
    };
}
