import * as React from 'react';

import './Layout.css';

import Aux from '../../hoc/Auxiliary';
import Toolbar from '../Navigation/Toolbar/Toolbar';
import SideDrawer from '../Navigation/SideDrawer/SideDrawer';

class Layout extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			showSideDrawer: false,
		};
	}

	render() {
		return (
			<Aux>
				<Toolbar drawerToggleClicked={this.sideDrawerToggleHandler} />
				<SideDrawer open={this.state.showSideDrawer} closed={this.sideDrawerCloseHandler} />
				<main className='Content'>{this.props.children}</main>
			</Aux>
		);
	}

	sideDrawerCloseHandler = () => {
		this.setState({ showSideDrawer: false });
	};

	sideDrawerToggleHandler = () => {
		this.setState(prevState => ({ showSideDrawer: !prevState.showSideDrawer }));
	};
}

export default Layout;
