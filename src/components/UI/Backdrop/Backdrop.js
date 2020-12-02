import * as React from 'react';

import './Backdrop.css';

const Backdrop = props => {
	if (!props.show) return null;

	return <div className='Backdrop' onClick={props.clicked}></div>;
};

export default Backdrop;
