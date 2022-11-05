export const Label = ({ htmlFor, children, ...rest }) => (<label htmlFor={htmlFor} className="block text-sm font-medium leading-5 text-gray-700" {...rest}>
    {children}
  </label>);
