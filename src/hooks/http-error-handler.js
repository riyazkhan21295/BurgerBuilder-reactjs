import * as React from 'react';

const useHttpErrorHandler = httpClient => {
    const [error, setError] = React.useState(null);

    const requestInterceptors = httpClient.interceptors.request.use(request => {
        setError(null);

        return request;
    });
    const responseInterceptors = httpClient.interceptors.response.use(
        response => response,
        error => {
            setError(error);
        },
    );

    React.useEffect(() => {
        return () => {
            httpClient.interceptors.request.eject(requestInterceptors);
            httpClient.interceptors.response.eject(responseInterceptors);
        };
    }, [httpClient, requestInterceptors, responseInterceptors]);

    const errorConfirmedHandler = () => {
        setError(null);
    };

    return [error, errorConfirmedHandler];
};

export default useHttpErrorHandler;
