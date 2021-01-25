import * as React from 'react';
import { connect } from 'react-redux';

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
                <Toolbar drawerToggleClicked={this.sideDrawerToggleHandler} isAuth={this.props.isAuthenticated} />
                <SideDrawer
                    open={this.state.showSideDrawer}
                    closed={this.sideDrawerCloseHandler}
                    isAuth={this.props.isAuthenticated}
                />
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

const mapStateToProps = state => {
    return {
        isAuthenticated: state.auth.token !== null ? true : false,
    };
};

export default connect(mapStateToProps)(Layout);
