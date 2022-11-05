import Link from 'next/link';
export const NextLink = ({ children, underline = false, className = '', href, ...props }) => {
    const border = underline
        ? 'border-b border-indigo-300 hover:border-indigo-400'
        : '';
    const isInternalLink = href?.startsWith('/');
    if (isInternalLink) {
        return (<Link href={href}>
        <a {...props} className={`${className} ${border}`}>
          {children}
        </a>
      </Link>);
    }
    return (<a href={href} className={className} {...props}>
      {children}
    </a>);
};
