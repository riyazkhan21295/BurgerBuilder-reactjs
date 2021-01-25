import * as React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import * as actionsCreators from '../../../store/actions/index';

class Logout extends React.Component {
    render() {
        return <Redirect to='/' />;
    }

    componentDidMount() {
        this.props.onLogout();
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onLogout: () => dispatch(actionsCreators.authLogout()),
    };
};

export default connect(null, mapDispatchToProps)(Logout);
