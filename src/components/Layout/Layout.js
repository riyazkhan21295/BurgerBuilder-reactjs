import * as React from 'react';
import { connect } from 'react-redux';

import './Layout.css';

import Aux from '../../hoc/Auxiliary';
import Toolbar from '../Navigation/Toolbar/Toolbar';
import SideDrawer from '../Navigation/SideDrawer/SideDrawer';

const Layout = props => {
    const [sideDrawerIsVisible, setSideDrawerIsVisible] = React.useState(false);

    const sideDrawerToggleHandler = () => {
        setSideDrawerIsVisible(!sideDrawerIsVisible);
    };

    const sideDrawerCloseHandler = () => {
        setSideDrawerIsVisible(false);
    };

    return (
        <Aux>
            <Toolbar drawerToggleClicked={sideDrawerToggleHandler} isAuth={props.isAuthenticated} />
            <SideDrawer open={sideDrawerIsVisible} closed={sideDrawerCloseHandler} isAuth={props.isAuthenticated} />
            <main className='Content'>{props.children}</main>
        </Aux>
    );
};

const mapStateToProps = state => {
    return {
        isAuthenticated: state.auth.token !== null ? true : false,
    };
};

export default connect(mapStateToProps)(Layout);
