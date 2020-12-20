import * as React from 'react';
import axiosInstance from '../../axios-orders';

import Order from '../../components/Order/Order';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';

class Orders extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			orders: [],
			loading: true,
		};
	}

	render() {
		return (
			<div>
				{this.state.orders.map(order => (
					<Order key={order.id} ingredients={order.ingredients} price={order.price} />
				))}
			</div>
		);
	}

	componentDidMount() {
		axiosInstance
			.get('/orders.json')
			.then(response => {
				console.log(response);
				const fetchedOrders = [];
				for (const key in response.data) {
					fetchedOrders.push({
						...response.data[key],
						id: key,
					});
				}

				this.setState({
					loading: false,
					orders: fetchedOrders,
				});
			})
			.catch(error => {
				this.setState({
					loading: false,
				});
			});
	}
}

export default withErrorHandler(Orders, axiosInstance);
