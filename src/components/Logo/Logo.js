import * as React from 'react';

import './Logo.css';
import burgerLogo from '../../assets/images/burger-logo.png';

const Logo = props => {
	return (
		<div className='Logo'>
			<img src={burgerLogo} alt='My Burger Logo' />
		</div>
	);
};

export default Logo;
