import { Notification, NotificationType } from '@components/notification';
import { createContext, useCallback, useContext, useMemo, useReducer, } from 'react';
import { ActionType, notificationReducer } from './notification-reducer';
export { NotificationType };
const NotificationContext = createContext([]);
export const NotificationProvider = ({ children }) => {
    const [state, dispatch] = useReducer(notificationReducer, []);
    const value = useMemo(() => [dispatch], [dispatch]);
    const closeNotification = useCallback((id) => {
        dispatch({ type: ActionType.REMOVE_NOTIFICATION, notification: { id } });
    }, []);
    return (<NotificationContext.Provider value={value}>
      <div className="hidden sm:fixed z-20 p-6 w-72 top-16 right-4">
        {state.map(notification => (<Notification key={notification.id} id={notification.id} type={notification.type} title={notification.title} message={notification.message} closeNotificationMs={notification.closeNotificationMs} closeNotification={closeNotification}/>))}
      </div>
      {children}
    </NotificationContext.Provider>);
};
export const useNotification = () => {
    const [dispatch] = useContext(NotificationContext);
    if (!dispatch) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    const addNotification = useCallback(({ type, title, message, closeNotificationMs, }) => {
        dispatch({
            type: ActionType.ADD_NOTIFICATION,
            notification: { type, title, message, closeNotificationMs },
        });
    }, [dispatch]);
    return { addNotification };
};
