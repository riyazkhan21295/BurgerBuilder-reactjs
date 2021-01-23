import * as React from 'react';
import axios from '../../../axios-orders';
import { connect } from 'react-redux';

import './ContactData.css';
import Button from '../../../components/UI/Button/Button';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Input from '../../../components/UI/Input/Input';

import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler';

import * as actionCreators from '../../../store/actions/index';
class ContactData extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            orderForm: {
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
            },
            formIsValid: false,
        };
    }

    render() {
        const formElementsArray = [];
        for (const key in this.state.orderForm) {
            formElementsArray.push({
                id: key,
                config: this.state.orderForm[key],
            });
        }

        let form = (
            <form onSubmit={this.orderHandler}>
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
                        changed={event => this.inputChangeHandler(event, formElement.id)}
                    />
                ))}
                <Button btnType='Success' clicked={this.orderHandler} disabled={!this.state.formIsValid}>
                    Order
                </Button>
            </form>
        );
        if (this.props.loading) form = <Spinner />;

        return (
            <div className='ContactData'>
                <h4>Enter your contact Data</h4>
                {form}
            </div>
        );
    }

    inputChangeHandler = (event, inputIdentifier) => {
        const updatedOrderForm = {
            ...this.state.orderForm,
        };

        const updateFormElement = {
            ...updatedOrderForm[inputIdentifier],
        };
        updateFormElement.value = event.target.value;
        // if (updateFormElement.validation) {
        updateFormElement.valid = this.checkValidity(updateFormElement.value, updateFormElement.validation);
        // }
        updateFormElement.touched = true;
        updatedOrderForm[inputIdentifier] = updateFormElement;

        let formIsValid = true;
        for (const inputIdentifiers in updatedOrderForm) {
            formIsValid = updatedOrderForm[inputIdentifiers].valid && formIsValid ? true : false;
        }

        this.setState({
            orderForm: updatedOrderForm,
            formIsValid: formIsValid,
        });
    };

    checkValidity = (value, rules) => {
        let isValid = true;
        if (!rules) return true;

        if (rules.required) {
            isValid = value.trim() !== '' && isValid ? true : false;
        }

        if (rules.minLength) {
            isValid = value.length >= rules.minLength && isValid ? true : false;
        }

        if (rules.maxLength) {
            isValid = value.length <= rules.maxLength && isValid ? true : false;
        }

        return isValid;
    };

    orderHandler = event => {
        event.preventDefault();

        const formData = {};
        for (const formElementIdentifier in this.state.orderForm) {
            formData[formElementIdentifier] = this.state.orderForm[formElementIdentifier].value;
        }

        const order = {
            ingredients: this.props.ingredients,
            price: this.props.totalPrice,
            orderData: formData,
        };

        this.props.onOrderBurger(order);
    };
}

const mapStateToProps = state => {
    return {
        ingredients: state.burgerBuilder.ingredients,
        totalPrice: state.burgerBuilder.totalPrice,
        loading: state.order.loading,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onOrderBurger: orderData => dispatch(actionCreators.purchaseBurgerStartAsync(orderData)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(ContactData, axios));
