import { Modal } from '@components/modal';
import { NotificationType, useNotification } from '@context/notification';
import { useEffect } from 'react';
import { FcLock } from 'react-icons/fc';
import { ChangePasswordForm } from './changePasswordForm';
import { useChangePassword } from './use-change-password';
export function ChangePasswordModal({ userConfig, showsPasswordModal,visibility,visible,message,visibility1,visible1,visibility2,visible2, closePasswordModal, }) {
    const { register, handleSubmit, formErrors, error, isError, isLoading, isSuccess, newPasswordRef, } = useChangePassword({ userConfig, closePasswordModal });
    const { addNotification } = useNotification();
    useEffect(() => {
        if(isSuccess){
            message(true)
        }
    }, [addNotification, error, isError, isSuccess]);
    return (<Modal title="Change Password" changePwd={true} showsModal={showsPasswordModal}  body={<ChangePasswordForm register={register} handleSubmit={handleSubmit} isSuccess={isSuccess} visibility={visibility} visibility1={visibility1} visible1={visible1} visibility2={visibility2} visible2={visible2} isError={isError} formErrors={formErrors} error={error} visible={visible} closeModal={closePasswordModal} isLoading={isLoading} newPasswordRef={newPasswordRef}/>}/>);
}

