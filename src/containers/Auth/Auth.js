import * as React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import Spinner from '../../components/UI/Spinner/Spinner';

import * as actionCreators from '../../store/actions/index';

import { checkValidity } from '../../shared/utility';

import './Auth.css';

const Auth = props => {
    const [authForm, setAuthForm] = React.useState({
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
    });
    const [isSignup, setIsSignup] = React.useState(true);

    const { buildingBurger, authRedirectPath, onSetAuthRedirectPath } = props;

    React.useEffect(() => {
        if (!buildingBurger && authRedirectPath !== '/') {
            onSetAuthRedirectPath('/');
        }
    }, [buildingBurger, authRedirectPath, onSetAuthRedirectPath]);

    const inputChangeHandler = (event, controlName) => {
        const updatedauthForm = {
            ...authForm,
            [controlName]: {
                ...authForm[controlName],
                value: event.target.value,
                valid: checkValidity(event.target.value, authForm[controlName].validation),
                touched: true,
            },
        };

        setAuthForm(updatedauthForm);
    };

    const submitHandler = event => {
        event.preventDefault();

        const { email, password } = authForm;

        props.onAuth(email.value, password.value, isSignup);
    };

    const switchAuthModeHandler = () => {
        setIsSignup(!isSignup);
    };

    let form = <Spinner />;
    if (!props.loading) {
        const formElementsArray = [];
        for (const key in authForm) {
            formElementsArray.push({
                id: key,
                config: authForm[key],
            });
        }

        form = (
            <React.Fragment>
                <form onSubmit={submitHandler}>
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
                    <Button btnType='Success'>SUBMIT</Button>
                </form>
                <Button clicked={switchAuthModeHandler} btnType='Danger'>
                    SWITCH TO {isSignup ? 'SIGNIN' : 'SIGNUP'}
                </Button>
            </React.Fragment>
        );
    }

    let errorMessage = null;
    if (props.error) {
        errorMessage = <p>{props.error.message}</p>;
    }

    let authRedirect = null;
    if (props.isAuthenticated) {
        authRedirect = <Redirect to={props.authRedirectPath} />;
    }

    return (
        <div className='Auth'>
            {authRedirect}
            {errorMessage}
            {form}
        </div>
    );
};

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
