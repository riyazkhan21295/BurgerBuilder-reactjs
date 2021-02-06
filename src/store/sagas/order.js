import axios from '../../axios-orders';
import { put } from 'redux-saga/effects';

import * as actionCreators from '../actions/index';

export function* purchaseBurgerStartSaga(action) {
    yield put(actionCreators.purchaseBurgerStart());

    try {
        const response = yield axios.post(`/orders.json?auth=${action.token}`, action.orderData);

        yield put(actionCreators.purchaseBurgerSuccess(response.data.name, action.orderData));
    } catch (error) {
        yield put(actionCreators.purchaseBurgerFail(error));
    }
}

export function* fetchOrderSaga(action) {
    yield put(actionCreators.fetchOrdersStart());

    try {
        const queryParams = yield `?auth=${action.token}&orderBy="userId"&equalTo="${action.userId}"`;
        const response = yield axios.get(`/orders.json${queryParams}`);

        const fetchedOrders = [];
        for (const key in response.data) {
            fetchedOrders.push({
                ...response.data[key],
                id: key,
            });
        }

        yield put(actionCreators.fetchOrdersSuccess(fetchedOrders));
    } catch (error) {
        yield put(actionCreators.fetchOrdersFail(error));
    }
}
