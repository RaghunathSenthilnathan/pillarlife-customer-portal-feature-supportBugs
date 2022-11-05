const initialState = {
    isLoading: true,
    error: undefined,
    isAuthenticated: false,
    isAuthenticating: true,
    user: undefined,
    userConfig: undefined,
};
export function authReducer(state, action) {
    switch (action.type) {
        case 'IS_LOGGING_IN': {
            return initialState;
        }
        case 'LOGIN_SUCCESS': {
            return {
                isLoading: false,
                error: undefined,
                isAuthenticated: true,
                isAuthenticating: false,
                user: action.user,
                userConfig: action.userConfig,
            };
        }
        case 'LOGIN_FAILURE': {
            return {
                ...initialState,
                isLoading: false,
                error: action.error,
                isAuthenticating: false,
            };
        }
        case 'LOGOUT_SUCCESS': {
            return {
                ...initialState,
                isLoading: false,
                isAuthenticating: false,
            };
        }
        case 'UPDATE_USER': {
            return {
                ...state,
                user: {
                    ...state.user,
                    ...action.updatedUserAttributes,
                },
            };
        }
        default: {
            throw new Error(`Unsupported action type: ${JSON.stringify(action)}`);
        }
    }
}