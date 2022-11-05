export const Center = ({ children, className = '', ...rest }) => (<div className={`flex justify-center items-center ${className}`} {...rest}>
    {children}
  </div>);
