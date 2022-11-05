export const Flex = ({ children, className = '', ...rest }) => (<div className={`flex ${className}`} {...rest}>
    {children}
  </div>);
