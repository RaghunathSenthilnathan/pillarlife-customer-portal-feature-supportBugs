export var ActionType;
(function (ActionType) {
    ActionType["ADD_NOTIFICATION"] = "add_notification";
    ActionType["REMOVE_NOTIFICATION"] = "remove_notification";
})(ActionType || (ActionType = {}));
export function notificationReducer(state, action) {
    switch (action.type) {
        case ActionType.ADD_NOTIFICATION: {
            return [
                ...state,
                { id: `${Math.random()}_${Date.now()}`, ...action.notification },
            ];
        }
        case ActionType.REMOVE_NOTIFICATION: {
            return state.filter(notification => notification.id !== action.notification.id);
        }
        default: {
            throw new Error(`Unhandled action type: ${JSON.stringify(action)}`);
        }
    }
}
