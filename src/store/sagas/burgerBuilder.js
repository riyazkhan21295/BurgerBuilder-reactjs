import axios from '../../axios-orders';
import { put } from 'redux-saga/effects';

import * as actionCreators from '../actions/index';

export function* initIngredientsSaga(action) {
    try {
        const response = yield axios.get('https://react-my-burger-d63ce.firebaseio.com/ingredients.json');

        yield put(actionCreators.setIngredients(response.data));
    } catch (error) {
        yield put(actionCreators.fetchIngredientsFailed());
    }
}
