import * as React from 'react';
import axiosInstance from '../../axios-orders';
import { connect } from 'react-redux';

import Order from '../../components/Order/Order';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';

import * as actionCreators from '../../store/actions/index';

class Orders extends React.Component {
    render() {
        let orders = <Spinner />;
        if (!this.props.loading) {
            orders = this.props.orders.map(order => (
                <Order key={order.id} ingredients={order.ingredients} price={order.price} />
            ));
        }

        return <div>{orders}</div>;
    }

    componentDidMount() {
        this.props.onFetchOrders(this.props.token, this.props.userId);
    }
}

const mapStateToProps = state => {
    return {
        orders: state.order.orders,
        loading: state.order.loading,
        token: state.auth.token,
        userId: state.auth.userId,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onFetchOrders: (token, userId) => dispatch(actionCreators.fetchOrdersStartAsync(token, userId)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(Orders, axiosInstance));
