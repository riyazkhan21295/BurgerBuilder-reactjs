import * as React from "react";
import Logo from "../../Logo/Logo";

import "./Toolbar.css";

import NavigationItems from "../NavigationItems/NavigationItems";
import DrawerToggle from "../SideDrawer/DrawerToggle/DrawerToggle";

const Toolbar = props => {
	return (
		<header className='Toolbar'>
			<DrawerToggle clicked={props.drawerToggleClicked} />
			<Logo />
			<nav class='DesktopOnly'>
				<NavigationItems />
			</nav>
		</header>
	);
};

export default Toolbar;
