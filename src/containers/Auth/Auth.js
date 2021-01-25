import * as React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import Spinner from '../../components/UI/Spinner/Spinner';

import * as actionCreators from '../../store/actions/index';

import './Auth.css';

class Auth extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            controls: {
                email: {
                    elementType: 'input',
                    elementConfig: {
                        type: 'email',
                        placeholder: 'Mail Address',
                    },
                    value: '',
                    validation: {
                        required: true,
                        isEmail: true,
                    },
                    valid: false,
                    touched: false,
                },
                password: {
                    elementType: 'input',
                    elementConfig: {
                        type: 'password',
                        placeholder: 'Password',
                    },
                    value: '',
                    validation: {
                        required: true,
                        minLength: 6,
                    },
                    valid: false,
                    touched: false,
                },
            },
            isSignup: true,
        };
    }

    render() {
        let form = <Spinner />;
        if (!this.props.loading) {
            const formElementsArray = [];
            for (const key in this.state.controls) {
                formElementsArray.push({
                    id: key,
                    config: this.state.controls[key],
                });
            }

            form = (
                <React.Fragment>
                    <form onSubmit={this.submitHandler}>
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
                        <Button btnType='Success'>SUBMIT</Button>
                    </form>
                    <Button clicked={this.switchAuthModeHandler} btnType='Danger'>
                        SWITCH TO {this.state.isSignup ? 'SIGNIN' : 'SIGNUP'}
                    </Button>
                </React.Fragment>
            );
        }

        let errorMessage = null;
        if (this.props.error) {
            errorMessage = <p>{this.props.error.message}</p>;
        }

        let authRedirect = null;
        if (this.props.isAuthenticated) {
            authRedirect = <Redirect to={this.props.authRedirectPath} />;
        }

        return (
            <div className='Auth'>
                {authRedirect}
                {errorMessage}
                {form}
            </div>
        );
    }

    componentDidMount() {
        if (!this.props.buildingBurger && this.props.authRedirectPath !== '/') {
            this.props.onSetAuthRedirectPath('/');
        }
    }

    inputChangeHandler = (event, controlName) => {
        const updatedControls = {
            ...this.state.controls,
            [controlName]: {
                ...this.state.controls[controlName],
                value: event.target.value,
                valid: this.checkValidity(event.target.value, this.state.controls[controlName].validation),
                touched: true,
            },
        };

        this.setState({
            controls: updatedControls,
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

    submitHandler = event => {
        event.preventDefault();

        const {
            controls: { email, password },
            isSignup,
        } = this.state;
        this.props.onAuth(email.value, password.value, isSignup);
    };

    switchAuthModeHandler = () => {
        this.setState(prevState => {
            return {
                isSignup: !prevState.isSignup,
            };
        });
    };
}

const mapStateToProps = state => {
    return {
        loading: state.auth.loading,
        error: state.auth.error,
        isAuthenticated: state.auth.token !== null ? true : false,
        buildingBurger: state.burgerBuilder.building,
        authRedirectPath: state.auth.authRedirectPath,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onAuth: (email, password, isSignup) => dispatch(actionCreators.authStartAsync(email, password, isSignup)),
        onSetAuthRedirectPath: path => dispatch(actionCreators.setAuthRedirectPath(path)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Auth);
