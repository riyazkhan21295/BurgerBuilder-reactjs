import * as React from 'react';
import axios from '../../axios-orders';

import Aux from '../../hoc/Auxiliary';

import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';

const INGREDIENT_PRICES = {
	salad: 0.5,
	cheese: 0.4,
	meat: 1.3,
	bacon: 0.7,
};

class BurgerBuilder extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			ingredients: null,
			totalPrice: 4,
			purchaseable: false,
			purchasing: false,
			loading: false,
			error: false,
		};
	}

	render() {
		const disabledInfo = {
			...this.state.ingredients,
		};
		for (const key in disabledInfo) disabledInfo[key] = disabledInfo[key] <= 0 ? true : false;

		let burger = this.state.error ? <p>Ingredients can't be loaded!</p> : <Spinner />;
		if (this.state.ingredients) {
			burger = (
				<Aux>
					<Burger ingredients={this.state.ingredients} />
					<BuildControls
						ingredientAdded={this.addIngredientHandler}
						ingredientRemoved={this.removeIngredientHandler}
						disabled={disabledInfo}
						purchaseable={this.state.purchaseable}
						ordered={this.purchaseHandler}
						price={this.state.totalPrice}
					/>
				</Aux>
			);
		}

		let orderSummary = null;
		if (this.state.ingredients) {
			orderSummary = (
				<OrderSummary
					ingredients={this.state.ingredients}
					purchaseCanceled={this.purchaseCancelHandler}
					purchaseContinued={this.purchaseContinueHandler}
					price={this.state.totalPrice}
				/>
			);
		}
		if (this.state.loading) orderSummary = this.state.error ? null : <Spinner />;

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
		axios
			.get('https://react-my-burger-d63ce.firebaseio.com/ingredients.json')
			.then(response => {
				this.setState({
					ingredients: response.data,
				});
			})
			.catch(error => {
				this.setState({
					error: true,
				});
			});
	}

	addIngredientHandler = type => {
		const oldQuantity = this.state.ingredients[type];
		const updatedQuantity = oldQuantity + 1;

		const updatedIngredients = {
			...this.state.ingredients,
		};
		updatedIngredients[type] = updatedQuantity;

		const priceAddition = INGREDIENT_PRICES[type];

		const oldTotalPrice = this.state.totalPrice;
		const newTotalPrice = oldTotalPrice + priceAddition;

		this.setState({
			totalPrice: newTotalPrice,
			ingredients: updatedIngredients,
		});

		this.updatePurchaseState(updatedIngredients);
	};

	removeIngredientHandler = type => {
		const oldQuantity = this.state.ingredients[type];
		if (oldQuantity <= 0) return;
		const updatedQuantity = oldQuantity - 1;

		const updatedIngredients = {
			...this.state.ingredients,
		};
		updatedIngredients[type] = updatedQuantity;

		const priceDeduction = INGREDIENT_PRICES[type];

		const oldTotalPrice = this.state.totalPrice;
		const newTotalPrice = oldTotalPrice - priceDeduction;

		this.setState({
			totalPrice: newTotalPrice,
			ingredients: updatedIngredients,
		});

		this.updatePurchaseState(updatedIngredients);
	};

	updatePurchaseState = ingredients => {
		const ingredientKeys = Object.keys(ingredients);

		const sum = ingredientKeys
			.map(key => ingredients[key])
			.reduce((accumulator, currentValue) => accumulator + currentValue, 0);

		this.setState({
			purchaseable: sum > 0 ? true : false,
		});
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
		const queryParams = [];
		for (const ingredientsKey in this.state.ingredients) {
			const ingredientCount = this.state.ingredients[ingredientsKey];
			queryParams.push(encodeURIComponent(ingredientsKey) + '=' + encodeURIComponent(ingredientCount));
		}
		queryParams.push(`price=${this.state.totalPrice}`);
		const queryString = queryParams.join('&');

		this.props.history.push({
			pathname: '/checkout',
			search: '?' + queryString,
		});
	};
}

export default withErrorHandler(BurgerBuilder, axios);
