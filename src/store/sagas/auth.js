import axios from 'axios';
import { put, delay, call } from 'redux-saga/effects';

import * as actionCreators from '../actions/index';

export function* authLogoutSaga(action) {
    // yield localStorage.removeItem('token');
    // yield localStorage.removeItem('expirationDate');
    // yield localStorage.removeItem('userId');

    yield call([localStorage, 'removeItem'], 'token');
    yield call([localStorage, 'removeItem'], 'expirationDate');
    yield call([localStorage, 'removeItem'], 'userId');

    yield put(actionCreators.authLogoutSucceed());
}

export function* checkAuthTimeoutSaga(action) {
    yield delay(+action.expirationTime * 1000);

    yield put(actionCreators.authLogout());
}

export function* authUserSaga(action) {
    yield put(actionCreators.authStart());

    const authData = {
        email: action.email,
        password: action.password,
        returnSecureToken: true,
    };

    let url = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyC6g_QO9XTY1rE1a-xNXDfJ3cl0JzcFcDw';
    if (!action.isSignup) {
        url =
            'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyC6g_QO9XTY1rE1a-xNXDfJ3cl0JzcFcDw';
    }

    try {
        const response = yield axios.post(url, authData);

        const { idToken, localId: userId, expiresIn } = response.data;

        const expirationDate = yield new Date(new Date().getTime() + +expiresIn * 1000);

        yield localStorage.setItem('token', idToken);
        yield localStorage.setItem('userId', userId);
        yield localStorage.setItem('expirationDate', expirationDate);

        yield put(actionCreators.authSuccess(idToken, userId));
        yield put(actionCreators.checkAuthTimeout(expiresIn));
    } catch (error) {
        yield put(actionCreators.authFail(error.response.data.error));
    }
}

export function* authCheckStateSaga(action) {
    const token = yield localStorage.getItem('token');
    if (!token) {
        yield put(actionCreators.authLogout());
    } else {
        const expirationDate = yield new Date(localStorage.getItem('expirationDate'));

        if (expirationDate <= new Date()) {
            yield put(actionCreators.authLogout());
        } else {
            const userId = yield localStorage.getItem('userId');

            yield put(actionCreators.authSuccess(token, userId));

            yield put(actionCreators.checkAuthTimeout((expirationDate.getTime() - new Date().getTime()) / 1000));
        }
    }
}
