import { render as defaultRender } from '@testing-library/react';
import { RouterContext } from 'next/dist/next-server/lib/router-context';
export * from '@testing-library/react';
const mockRouter = {
    basePath: '',
    pathname: '/',
    route: '/',
    asPath: '/',
    query: {},
    isReady: true,
    push: jest.fn(),
    replace: jest.fn(),
    reload: jest.fn(),
    back: jest.fn(),
    prefetch: jest.fn(),
    beforePopState: jest.fn(),
    events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
    },
    isFallback: false,
    isLocaleDomain: true,
    isPreview: false,
};
export function render(ui, { wrapper, router, ...options } = {}) {
    if (!wrapper) {
        // eslint-disable-next-line no-param-reassign, react/display-name
        wrapper = ({ children }) => (<RouterContext.Provider value={{ ...mockRouter, ...router }}>
        {children}
      </RouterContext.Provider>);
    }
    return defaultRender(ui, { wrapper, ...options });
}
