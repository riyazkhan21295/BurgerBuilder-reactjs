import * as React from 'react';

import './Input.css';

const Input = props => {
	let inputElement = null;

	const inputClasses = ['InputElement', props.invalid && props.shouldValidate && props.touched ? 'Invalid' : '']
		.join(' ')
		.trim();

	switch (props.elementType) {
		case 'input':
			inputElement = (
				<input className={inputClasses} {...props.elementConfig} value={props.value} onChange={props.changed} />
			);
			break;

		case 'textarea':
			inputElement = (
				<textarea
					className={inputClasses}
					{...props.elementConfig}
					value={props.value}
					onChange={props.changed}
				/>
			);
			break;

		case 'select':
			inputElement = (
				<select className={inputClasses} value={props.value} onChange={props.changed}>
					{props.elementConfig.options.map(option => {
						const { value, displayValue } = option;
						return (
							<option key={value} value={value}>
								{displayValue}
							</option>
						);
					})}
				</select>
			);
			break;

		default:
			inputElement = (
				<input className={inputClasses} {...props.elementConfig} value={props.value} onChange={props.changed} />
			);
	}

	let validationError = null;
	if (props.invalid && props.touched) {
		validationError = <p className='ValidationError'>{props.errorMessage}</p>;
	}

	return (
		<div className='Input'>
			<label className='Label'>{props.label}</label>
			{inputElement}
			{validationError}
		</div>
	);
};

export default Input;
