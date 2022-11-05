import { ProgressSpinner } from "primereact/progressspinner";
import { NotificationType, useNotification } from '@context/notification';
import { withAnonymous } from '@utils/route-hocs';
import { useEffect } from 'react';
import { useCompleteRegistration } from './use-complete-registration';
export default withAnonymous(CompleteRegistration);
function CompleteRegistration() {
    const { isError, error, isLoading, isIdle } = useCompleteRegistration();
    const { addNotification } = useNotification();
    useEffect(() => {
        if (isError && error) {
            addNotification({
                type: NotificationType.ERROR,
                title: error.message,
                message: 'Your request has failed.',
            });
        }
    }, [addNotification, error, isError]);
    return <>{(isLoading || isIdle) &&  <ProgressSpinner className="fixed top-1/2 right-0  left-0 sm: object-fill" />}</>;
}
