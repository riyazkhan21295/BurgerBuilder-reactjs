import * as React from 'react';
import axios from '../../axios-orders';
import { connect } from 'react-redux';

import Aux from '../../hoc/Auxiliary';

import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';

import * as actionCreators from '../../store/actions/index';

class BurgerBuilder extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            purchasing: false,
        };
    }

    render() {
        const disabledInfo = {
            ...this.props.ingredients,
        };
        for (const key in disabledInfo) disabledInfo[key] = disabledInfo[key] <= 0 ? true : false;

        let burger = this.props.error ? <p>Ingredients can't be loaded!</p> : <Spinner />;
        if (this.props.ingredients) {
            burger = (
                <Aux>
                    <Burger ingredients={this.props.ingredients} />
                    <BuildControls
                        ingredientAdded={this.props.onIngredientAdded}
                        ingredientRemoved={this.props.onIngredientRemoved}
                        disabled={disabledInfo}
                        purchaseable={this.updatePurchaseState(this.props.ingredients)}
                        ordered={this.purchaseHandler}
                        price={this.props.totalPrice}
                    />
                </Aux>
            );
        }

        let orderSummary = null;
        if (this.props.ingredients) {
            orderSummary = (
                <OrderSummary
                    ingredients={this.props.ingredients}
                    purchaseCanceled={this.purchaseCancelHandler}
                    purchaseContinued={this.purchaseContinueHandler}
                    price={this.props.totalPrice}
                />
            );
        }

        return (
            <Aux>
                {burger}
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
                    {orderSummary}
                </Modal>
            </Aux>
        );
    }

    componentDidMount() {
        console.log(this.props);
        this.props.onInitIngredients();
    }

    updatePurchaseState = ingredients => {
        const sum = Object.keys(ingredients)
            .map(key => ingredients[key])
            .reduce((accumulator, currentValue) => accumulator + currentValue, 0);

        return sum > 0 ? true : false;
    };

    purchaseHandler = () => {
        this.setState({
            purchasing: true,
        });
    };

    purchaseCancelHandler = () => {
        this.setState({
            purchasing: false,
        });
    };

    purchaseContinueHandler = () => {
        this.props.onInitPurchase();
        this.props.history.push('/checkout');
    };
}

const mapStateToProps = state => {
    return {
        ingredients: state.burgerBuilder.ingredients,
        totalPrice: state.burgerBuilder.totalPrice,
        error: state.burgerBuilder.error,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onIngredientAdded: ingredientName => dispatch(actionCreators.addIngredient(ingredientName)),
        onIngredientRemoved: ingredientName => dispatch(actionCreators.removeIngredient(ingredientName)),
        onInitIngredients: () => dispatch(actionCreators.setIngredientsAsync()),
        onInitPurchase: () => dispatch(actionCreators.purchaseInit()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));
