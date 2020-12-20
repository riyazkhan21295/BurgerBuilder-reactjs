import * as React from 'react';
import { Route } from 'react-router-dom';

import CheckoutSummary from '../../components/Order/CheckoutSummary/CheckoutSummary';
import ContactData from './ContactData/ContactData';

class Checkout extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			ingredients: null,
			totalPrice: 0,
		};
	}

	render() {
		return (
			<div>
				<CheckoutSummary
					ingredients={this.state.ingredients}
					checkoutCancelled={this.checkoutCancelledHandler}
					checkoutContinued={this.checkoutContinuedHandler}
				/>
				<Route
					path={this.props.match.path + '/contact-data'}
					render={props => (
						<ContactData ingredients={this.state.ingredients} price={this.state.totalPrice} {...props} />
					)}
				/>
			</div>
		);
	}

	componentWillMount() {
		const ingredients = {};
		let price = 0;

		const query = new URLSearchParams(this.props.location.search);
		for (const param of query.entries()) {
			const [ingredientKey, ingredientCount] = param;
			if (ingredientKey === 'price') {
				price = ingredientCount;
			} else {
				ingredients[ingredientKey] = +ingredientCount;
			}
		}

		this.setState({
			ingredients: ingredients,
			totalPrice: price,
		});
	}

	checkoutCancelledHandler = () => {
		this.props.history.goBack();
	};

	checkoutContinuedHandler = () => {
		this.props.history.replace('/checkout/contact-data');
	};
}

export default Checkout;
