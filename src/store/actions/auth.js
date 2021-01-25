import axios from 'axios';

import * as actionTypes from './actionTypes';

const authStart = () => {
    return {
        type: actionTypes.AUTH_START,
    };
};

const authSuccess = (token, userId) => {
    return {
        type: actionTypes.AUTH_SUCCESS,
        idToken: token,
        userId,
    };
};

const authFail = error => {
    return {
        type: actionTypes.AUTH_FAIL,
        error,
    };
};

const checkAuthTimeoutAsync = expirationTime => {
    return dispatch => {
        setTimeout(() => {
            dispatch(authLogout());
        }, +expirationTime * 1000);
    };
};

export const authStartAsync = (email, password, isSignup) => {
    return dispatch => {
        dispatch(authStart());

        const authData = {
            email,
            password,
            returnSecureToken: true,
        };

        let url =
            'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyC6g_QO9XTY1rE1a-xNXDfJ3cl0JzcFcDw';
        if (!isSignup) {
            url =
                'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyC6g_QO9XTY1rE1a-xNXDfJ3cl0JzcFcDw';
        }

        axios
            .post(url, authData)
            .then(response => {
                console.log(response);

                const { idToken, localId: userId, expiresIn } = response.data;

                localStorage.setItem('token', idToken);
                localStorage.setItem('userId', userId);

                const expirationDate = new Date(new Date().getTime() + +expiresIn * 1000);
                localStorage.setItem('expirationDate', expirationDate);

                dispatch(authSuccess(idToken, userId));
                dispatch(checkAuthTimeoutAsync(expiresIn));
            })
            .catch(error => {
                console.log(error);
                dispatch(authFail(error.response.data.error));
            });
    };
};

export const authLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('expirationDate');
    localStorage.removeItem('userId');

    return {
        type: actionTypes.AUTH_LOGOUT,
    };
};

export const setAuthRedirectPath = path => {
    return {
        type: actionTypes.SET_AUTH_REDIRECT_PATH,
        path,
    };
};

export const authCheckState = () => {
    return dispatch => {
        const token = localStorage.getItem('token');
        if (!token) {
            dispatch(authLogout());
        } else {
            const expirationDate = new Date(localStorage.getItem('expirationDate'));

            if (expirationDate <= new Date()) {
                dispatch(authLogout());
            } else {
                const userId = localStorage.getItem('userId');

                dispatch(authSuccess(token, userId));

                dispatch(checkAuthTimeoutAsync((expirationDate.getTime() - new Date().getTime()) / 1000));
            }
        }
    };
};
