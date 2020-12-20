import * as React from 'react';
import axios from '../../../axios-orders';

import './ContactData.css';
import Button from '../../../components/UI/Button/Button';
import Spinner from '../../../components/UI/Spinner/Spinner';

class ContactData extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			name: '',
			email: '',
			address: {
				street: '',
				postalcode: '',
			},
			loading: false,
		};
	}

	render() {
		let form = (
			<form>
				<input type='text' className='Input' name='name' placeholder='Your Name' />
				<input type='text' className='Input' name='email' placeholder='Your Email' />
				<input type='text' className='Input' name='street' placeholder='Street' />
				<input type='text' className='Input' name='postalcode' placeholder='Postalcode' />
				<Button btnType='Success' clicked={this.orderHandler}>
					Order
				</Button>
			</form>
		);
		if (this.state.loading) form = <Spinner />;

		return (
			<div className='ContactData'>
				<h4>Enter your contact Data</h4>
				{form}
			</div>
		);
	}

	orderHandler = event => {
		event.preventDefault();

		this.setState({ loading: true });
		const order = {
			ingredients: this.props.ingredients,
			price: this.props.price,
			customer: {
				name: 'Riyaz Khan',
				address: {
					street: 'Teststreet 1',
					zipCode: '412345',
					country: 'India',
				},
				email: 'test@test.com',
			},
			deliveryMethod: 'fastest',
		};
		axios
			.post('/orders.json', order)
			.then(response => {
				this.setState({ loading: false });
				this.props.history.push('/');
			})
			.catch(error => {
				this.setState({ loading: false });
			});
	};
}

export default ContactData;
