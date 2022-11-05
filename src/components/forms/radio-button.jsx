import { forwardRef, } from 'react';
export const RadioInput = forwardRef(({ disabled, ...rest }, ref) => {
    const disabledClasses = disabled ? 'opacity-50 cursror-not-allowed' : '';
    return (<input ref={ref} type="radio" className={`${disabledClasses} w-4 h-4 text-indigo-600 border-gray-300 focus:quotecolor`} disabled={disabled} {...rest}/>);
});
RadioInput.displayName = 'RadioInput';
export const RadioLabel = ({ htmlFor, children, ...rest }) => (<label htmlFor={htmlFor} className="block ml-1 text-base font-medium text-gray-700" {...rest}>
    {children}
  </label>);
