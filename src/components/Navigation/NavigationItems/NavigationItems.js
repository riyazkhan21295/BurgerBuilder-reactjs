import * as React from 'react';
import NavigationItem from './NavigationItem/NavigationItem';

import './NavigationItems.css';

const NavigationItems = props => {
	return (
		<ul className='NavigationItems'>
			<NavigationItem link='/' active>
				Burger Builder
			</NavigationItem>
			<NavigationItem link='/'>Checkout</NavigationItem>
		</ul>
	);
};

export default NavigationItems;
