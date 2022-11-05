export const Container = ({ children, className = '', ...rest }) => (<div className={`container ${className}`} {...rest}>
    {children}
  </div>);
