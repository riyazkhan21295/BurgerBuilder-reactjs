import * as React from "react";

import BuildControls from "../../components/Burger/BuildControls/BuildControls";
import Burger from "../../components/Burger/Burger";

import Aux from "../../hoc/Auxiliary";

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
			ingredients: {
				salad: 0,
				bacon: 0,
				cheese: 0,
				meat: 0,
			},
			totalPrice: 4,
			purchaseable: false,
		};
	}

	render() {
		const disabledInfo = {
			...this.state.ingredients,
		};
		for (const key in disabledInfo) disabledInfo[key] = disabledInfo[key] <= 0 ? true : false;

		return (
			<Aux>
				<Burger ingredients={this.state.ingredients} />
				<BuildControls
					ingredientAdded={this.addIngredientHandler}
					ingredientRemoved={this.removeIngredientHandler}
					disabled={disabledInfo}
					purchaseable={this.state.purchaseable}
					price={this.state.totalPrice}
				/>
			</Aux>
		);
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
}

export default BurgerBuilder;
