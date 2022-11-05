export const UserDropdownButton = ({ onClick, children, }) => {
    return (<button type="button" onClick={onClick} className="flex text-sm bg-white rounded-full focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500">
      <span className="sr-only">Open user menu</span>
      {children}
    </button>);
};
export const UserDropdownLinks = ({ children, className, ...rest }) => {
    return (<div className={className} {...rest}>
      {children}
    </div>);
};
