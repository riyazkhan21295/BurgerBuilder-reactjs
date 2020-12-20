import * as React from 'react';

import './Order.css';

const Order = props => {
	const ingredients = [];
	for (const ingredientName in props.ingredients) {
		ingredients.push({
			name: ingredientName,
			count: props.ingredients[ingredientName],
		});
	}

	const ingredientOutput = ingredients.map(ingredient => {
		return (
			<span
				key={ingredient.name}
				style={{
					textTransform: 'capitalize',
					display: 'inline-block',
					margin: '0 8px',
					border: '1px solid #ccc',
					padding: '5px',
					borderRadius: '0.5rem',
				}}>
				{ingredient.name} ({ingredient.count})
			</span>
		);
	});

	return (
		<div className='Order'>
			<p>Ingredients: {ingredientOutput}</p>
			<p>
				Price: <strong>USD {Number(props.price).toFixed(2)}</strong>
			</p>
		</div>
	);
};

export default Order;
