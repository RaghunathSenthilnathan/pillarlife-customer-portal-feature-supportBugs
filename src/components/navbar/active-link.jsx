import Link from 'next/link';
import { useRouter } from 'next/router';
import { Children, cloneElement } from 'react';
export const ActiveLink = ({ children, activeClassName, inactiveClassName, ...props }) => {
    const { asPath } = useRouter();
    const child = Children.only(children);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const childClassName = child.props?.className || '';
    // pages/index.js will be matched via props.href
    // pages/about.js will be matched via props.href
    // pages/[slug].js will be matched via props.as
    const { href, as } = props;
    const className = 
    // eslint-disable-next-line no-nested-ternary
    asPath === href || asPath === as
        ? `${childClassName} ${activeClassName}`.trim()
        : inactiveClassName
            ? `${childClassName} ${inactiveClassName}`.trim()
            : childClassName;
    return (<Link {...props}>
      {cloneElement(child, {
            className: className || null,
        })}
    </Link>);
};
