import * as React from 'react';

import Aux from '../../../hoc/Auxiliary';
import Backdrop from '../Backdrop/Backdrop';

import './Modal.css';

const Modal = props => {
    // shouldComponentUpdate(nextProps, nextState) {
    //     if (nextProps.show !== this.props.show || nextProps.children !== this.props.children) {
    //         return true;
    //     }

    //     return false;
    // }

    const style = {
        transform: props.show ? 'translateY(0)' : 'translateY(-100vh)',
        opacity: props.show ? '1' : '0',
    };

    return (
        <Aux>
            <Backdrop show={props.show} clicked={props.modalClosed} />
            <div className='Modal' style={style}>
                {props.children}
            </div>
        </Aux>
    );
};

export default React.memo(Modal, (prevProps, nextProps) => {
    if (nextProps.show === prevProps.show && nextProps.children === prevProps.children) {
        return true;
    }

    return false;
});
