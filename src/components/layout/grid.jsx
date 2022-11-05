export const Grid = ({ children, className = '', ...rest }) => (<div className={`grid ${className}`} {...rest}>
    {children}
  </div>);
