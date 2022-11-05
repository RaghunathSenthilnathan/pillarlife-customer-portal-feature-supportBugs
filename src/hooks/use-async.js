import React from 'react';
function useSafeDispatch(dispatch) {
    const mounted = React.useRef(false);
    React.useLayoutEffect(() => {
        mounted.current = true;
        return () => {
            mounted.current = false;
        };
    }, []);
    return React.useCallback(action => (mounted.current ? dispatch(action) : undefined), [dispatch]);
}
const defaultInitialState = {
    status: 'idle',
    data: null,
    error: null,
};
export function useAsync(initialState) {
    const initialStateRef = React.useRef({
        ...defaultInitialState,
        ...initialState,
    });
    function reducer(state, action) {
        return {
            ...state,
            ...action,
        };
    }
    const [{ status, data, error }, setState] = React.useReducer(reducer, initialStateRef.current);
    const safeSetState = useSafeDispatch(setState);
    const setData = React.useCallback((newData) => safeSetState({ status: 'resolved', data: newData }), [safeSetState]);
    const setError = React.useCallback((newError) => safeSetState({ status: 'rejected', error: newError }), [safeSetState]);
    const reset = React.useCallback(() => safeSetState(initialStateRef.current), [
        safeSetState,
    ]);
    // this is from kent c dodds' epic-react course
    const run = React.useCallback((promise) => {
        if (!promise.then) {
            throw new Error("The argument passed to useAsync().run must be a promise. Maybe a function that's passed isn't returning anything?");
        }
        safeSetState({ status: 'pending' });
        return promise
            .then(promiseData => {
            safeSetState({ status: 'resolved', data: promiseData });
            return promiseData;
        })
            .catch(promiseError => {
            if (promiseError instanceof Error) {
                safeSetState({ status: 'rejected', error: promiseError });
                return promiseError;
            }
            if (typeof promiseError === 'object' && 'message' in promiseError) {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                const e = new Error(promiseError.message);
                safeSetState({
                    status: 'rejected',
                    error: e,
                });
                return e;
            }
            safeSetState({
                status: 'rejected',
                error: new Error(JSON.stringify(promiseError)),
            });
            return new Error(JSON.stringify(promiseError));
        });
    }, [safeSetState]);
    return {
        // using the same names that react-query uses for convenience
        isIdle: status === 'idle',
        isLoading: status === 'pending',
        isError: status === 'rejected',
        isSuccess: status === 'resolved',
        setData,
        setError,
        error,
        status,
        data,
        run,
        reset,
    };
}
