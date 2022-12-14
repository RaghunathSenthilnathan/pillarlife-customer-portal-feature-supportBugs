/* eslint-disable camelcase */
import {Auth} from '@aws-amplify/auth';
import { useAsync } from '@hooks/use-async';
import { usePrevious } from '@hooks/use-previous';
import { useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { uploadToS3 } from './upload-file';
import { useFileChange } from './use-file-change';
export function useUpdateProfile({ user, userConfig, updateUserAttributes, }) {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const { register, handleSubmit, errors: formErrors, setValue, } = useForm();
    const { error, status, isLoading, isSuccess, isError, run, setError, } = useAsync();
    const setFormValues = useCallback(() => {
        setValue('bio', user?.bio);
        setValue('givenName', user?.givenName);
        setValue('familyName', user?.familyName);
        setValue('referralCode', user?.referralCode);
    }, [setValue, user?.bio, user?.familyName, user?.givenName, user?.referralCode]);
    useEffect(() => {
        setFormValues();
    }, [setFormValues]);
    const prevIsError = usePrevious(isError);
    useEffect(() => {
        if (isError && !prevIsError) {
            setFormValues();
        }
    }, [isError, prevIsError, setFormValues]);
    const { fileError, fileName, fileContents, fileType, fileDispatch, handleFileChange, } = useFileChange();
    const onSubmit = ({ givenName, familyName, bio, referralCode, }) => {
        run(uploadToS3AndUpdateProfileAttributes());
        async function uploadToS3AndUpdateProfileAttributes() {
            let filePath = '';
            if (fileContents && fileType) {
                filePath = await uploadToS3({ fileType, fileContents });
                fileDispatch({ type: 'RESET_FILE_STATE' });
            }
            const result = await saveProfileAttributes(filePath);
            if (filePath) {
                updateUserAttributes({ picture: filePath, givenName, familyName, bio, referralCode });
            }
            else {
                updateUserAttributes({ givenName, familyName, bio, referralCode });
            }
            return result;
        }
        async function saveProfileAttributes(filePath) {
            const profileAttributes = {
                given_name: givenName,
                family_name: familyName,
                'custom:bio': bio,
                'custom:referral_code': referralCode
            };
            if (filePath) {
                profileAttributes.picture = filePath;
            }
            return Auth.updateUserAttributes(userConfig, profileAttributes);
        }
    };
    const handleClearPictureAttribute = async () => {
        try {
            await Auth.updateUserAttributes(userConfig, { picture: '' });
            updateUserAttributes({ picture: '' });
        }
        catch (err) {
            if (typeof err === 'object' && 'message' in err) {
                setError(err);
            }
            else {
                setError(new Error(err));
            }
        }
    };
    return {
        register,
        handleSubmit: handleSubmit(onSubmit),
        handleFileChange,
        handleClearPictureAttribute,
        fileError,
        fileName,
        formErrors,
        isLoading,
        error,
        isError,
        isSuccess,
        status,
    };
}
