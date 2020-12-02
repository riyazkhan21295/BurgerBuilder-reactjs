import * as React from 'react';

import './Toolbar.css';

import Logo from '../../Logo/Logo';
import DrawerToggle from '../SideDrawer/DrawerToggle/DrawerToggle';
import NavigationItems from '../NavigationItems/NavigationItems';

const Toolbar = props => {
	return (
		<header className='Toolbar'>
			<DrawerToggle clicked={props.drawerToggleClicked} />
			<Logo />
			<nav className='DesktopOnly'>
				<NavigationItems />
			</nav>
		</header>
	);
};

export default Toolbar;
