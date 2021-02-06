import * as React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import * as actionsCreators from '../../../store/actions/index';

const Logout = props => {
    const { onLogout } = props;

    React.useEffect(() => {
        onLogout();
    }, [onLogout]);

    return <Redirect to='/' />;
};

const mapDispatchToProps = dispatch => {
    return {
        onLogout: () => dispatch(actionsCreators.authLogout()),
    };
};

export default connect(null, mapDispatchToProps)(Logout);
