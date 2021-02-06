import * as React from 'react';
import axios from '../../axios-orders';
import { useDispatch, useSelector } from 'react-redux';

import Aux from '../../hoc/Auxiliary';

import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';

import * as actionCreators from '../../store/actions/index';

export const BurgerBuilder = props => {
    const [purchasing, setPurchasing] = React.useState(false);

    const ings = useSelector(state => state.burgerBuilder.ingredients);
    const totalPrice = useSelector(state => state.burgerBuilder.totalPrice);
    const error = useSelector(state => state.burgerBuilder.error);
    const isAuthenticated = useSelector(state => (state.auth.token !== null ? true : false));

    const dispatch = useDispatch();
    const onIngredientAdded = ingredientName => dispatch(actionCreators.addIngredient(ingredientName));
    const onIngredientRemoved = ingredientName => dispatch(actionCreators.removeIngredient(ingredientName));
    const onInitIngredients = React.useCallback(() => dispatch(actionCreators.initIngredients()), [dispatch]);
    const onInitPurchase = () => dispatch(actionCreators.purchaseInit());
    const onSetAuthRedirectPath = path => dispatch(actionCreators.setAuthRedirectPath(path));

    React.useEffect(() => {
        onInitIngredients();
    }, [onInitIngredients]);

    const updatePurchaseState = ingredients => {
        const sum = Object.keys(ingredients)
            .map(key => ingredients[key])
            .reduce((accumulator, currentValue) => accumulator + currentValue, 0);

        return sum > 0 ? true : false;
    };

    const purchaseHandler = () => {
        if (isAuthenticated) {
            setPurchasing(true);
        } else {
            onSetAuthRedirectPath('/checkout');
            props.history.push('/auth');
        }
    };

    const purchaseCancelHandler = () => {
        setPurchasing(false);
    };

    const purchaseContinueHandler = () => {
        onInitPurchase();
        props.history.push('/checkout');
    };

    const disabledInfo = {
        ...ings,
    };
    for (const key in disabledInfo) disabledInfo[key] = disabledInfo[key] <= 0 ? true : false;

    let burger = error ? <p>Ingredients can't be loaded!</p> : <Spinner />;
    if (ings) {
        burger = (
            <Aux>
                <Burger ingredients={ings} />
                <BuildControls
                    ingredientAdded={onIngredientAdded}
                    ingredientRemoved={onIngredientRemoved}
                    disabled={disabledInfo}
                    purchaseable={updatePurchaseState(ings)}
                    ordered={purchaseHandler}
                    price={totalPrice}
                    isAuth={isAuthenticated}
                />
            </Aux>
        );
    }

    let orderSummary = null;
    if (ings) {
        orderSummary = (
            <OrderSummary
                ingredients={ings}
                purchaseCanceled={purchaseCancelHandler}
                purchaseContinued={purchaseContinueHandler}
                price={totalPrice}
            />
        );
    }

    return (
        <Aux>
            {burger}
            <Modal show={purchasing} modalClosed={purchaseCancelHandler}>
                {orderSummary}
            </Modal>
        </Aux>
    );
};

export default withErrorHandler(BurgerBuilder, axios);
