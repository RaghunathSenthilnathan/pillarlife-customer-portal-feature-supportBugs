import { useEffect, useRef } from 'react';
export const useClickOutside = (elRef, callback) => {
    const callbackRef = useRef(callback);
    callbackRef.current = callback;
    useEffect(() => {
        const handleClickOutside = (e) => {
            // if the base element does not contain the element the user clicked on - call the callback
            if (!elRef?.current?.contains(e.target) &&
                callbackRef.current) {
                callbackRef.current(e);
            }
        };
        document.addEventListener('click', handleClickOutside, true);
        return () => {
            document.removeEventListener('click', handleClickOutside, true);
        };
    }, [callbackRef, elRef]);
};
