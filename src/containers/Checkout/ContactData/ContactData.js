import * as React from 'react';
import axios from '../../../axios-orders';
import { connect } from 'react-redux';

import './ContactData.css';
import Button from '../../../components/UI/Button/Button';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Input from '../../../components/UI/Input/Input';

import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler';

import * as actionCreators from '../../../store/actions/index';

import { checkValidity } from '../../../shared/utility';
const ContactData = props => {
    const [orderForm, setOrderForm] = React.useState({
        name: {
            elementType: 'input',
            elementConfig: {
                type: 'text',
                placeholder: 'Your Name',
            },
            value: '',
            validation: {
                required: true,
            },
            valid: false,
            touched: false,
            errorMessage: 'Please enter a valid Name',
        },
        street: {
            elementType: 'input',
            elementConfig: {
                type: 'text',
                placeholder: 'Street',
            },
            value: '',
            validation: {
                required: true,
            },
            valid: false,
            touched: false,
            errorMessage: 'Please enter a valid Street Address',
        },
        zipCode: {
            elementType: 'input',
            elementConfig: {
                type: 'text',
                placeholder: 'ZIP Code',
            },
            value: '',
            validation: {
                required: true,
                minLength: 6,
                maxLength: 6,
            },
            valid: false,
            touched: false,
            errorMessage: 'Please enter a valid ZIP Code',
        },
        country: {
            elementType: 'input',
            elementConfig: {
                type: 'text',
                placeholder: 'Country',
            },
            value: '',
            validation: {
                required: true,
            },
            valid: false,
            touched: false,
            errorMessage: 'Please enter a valid Country',
        },
        email: {
            elementType: 'input',
            elementConfig: {
                type: 'email',
                placeholder: 'Your E-Mail',
            },
            value: '',
            validation: {
                required: true,
            },
            valid: false,
            touched: false,
            errorMessage: 'Please enter a valid Email Address',
        },
        deliveryMethod: {
            elementType: 'select',
            elementConfig: {
                options: [
                    {
                        value: 'fastest',
                        displayValue: 'Fastest',
                    },
                    {
                        value: 'cheapest',
                        displayValue: 'Cheapest',
                    },
                ],
            },
            value: 'fastest',
            validation: {},
            valid: true,
        },
    });
    const [formIsValid, setFormIsValid] = React.useState(false);

    const inputChangeHandler = (event, inputIdentifier) => {
        const updatedOrderForm = {
            ...orderForm,
        };

        const updateFormElement = {
            ...updatedOrderForm[inputIdentifier],
        };
        updateFormElement.value = event.target.value;
        // if (updateFormElement.validation) {
        updateFormElement.valid = checkValidity(updateFormElement.value, updateFormElement.validation);
        // }
        updateFormElement.touched = true;
        updatedOrderForm[inputIdentifier] = updateFormElement;

        let formIsValid = true;
        for (const inputIdentifiers in updatedOrderForm) {
            formIsValid = updatedOrderForm[inputIdentifiers].valid && formIsValid ? true : false;
        }

        setOrderForm(updatedOrderForm);
        setFormIsValid(formIsValid);
    };

    const orderHandler = event => {
        event.preventDefault();

        const formData = {};
        for (const formElementIdentifier in orderForm) {
            formData[formElementIdentifier] = orderForm[formElementIdentifier].value;
        }

        const order = {
            ingredients: props.ingredients,
            price: props.totalPrice,
            orderData: formData,
            userId: props.userId,
        };

        props.onOrderBurger(order, props.token);
    };

    const formElementsArray = [];
    for (const key in orderForm) {
        formElementsArray.push({
            id: key,
            config: orderForm[key],
        });
    }

    let form = (
        <form onSubmit={orderHandler}>
            {formElementsArray.map(formElement => (
                <Input
                    key={formElement.id}
                    elementType={formElement.config.elementType}
                    elementConfig={formElement.config.elementConfig}
                    value={formElement.config.value}
                    invalid={!formElement.config.valid}
                    shouldValidate={formElement.config.validation}
                    touched={formElement.config.touched}
                    errorMessage={formElement.config.errorMessage}
                    changed={event => inputChangeHandler(event, formElement.id)}
                />
            ))}
            <Button btnType='Success' clicked={orderHandler} disabled={!formIsValid}>
                Order
            </Button>
        </form>
    );
    if (props.loading) form = <Spinner />;

    return (
        <div className='ContactData'>
            <h4>Enter your contact Data</h4>
            {form}
        </div>
    );
};

const mapStateToProps = state => {
    return {
        ingredients: state.burgerBuilder.ingredients,
        totalPrice: state.burgerBuilder.totalPrice,
        loading: state.order.loading,
        token: state.auth.token,
        userId: state.auth.userId,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onOrderBurger: (orderData, token) => dispatch(actionCreators.purchaseBurger(orderData, token)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(ContactData, axios));
