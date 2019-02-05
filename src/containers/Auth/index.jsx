import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import Input from '../UI/Input';
import Button from '../UI/Button';
import Spinner from '../UI/Spinner';
import classes from './Auth.css';
import * as actions from '../../store/actions';

class Auth extends Component {

  state = {
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

  checkValidity(value, rules) {
    let isValid = true;
    if (!rules) {
      return isValid;
    }
    if (rules.required) {
      isValid = isValid && value.trim() !== '';
    }
    if (rules.minLength) {
      isValid = isValid && value.trim().length >= rules.minLength;
    }
    if (rules.maxLength) {
      isValid = isValid && value.trim().length <= rules.maxLength;
    }
    return isValid;
  }

  inputChangedHandler = (event, inputIdentifier) => {
    const controls = {
      ...this.state.controls,
    }
    const formEl = {
      ...controls[inputIdentifier],
    };
    formEl.value = event.target.value;
    formEl.valid = this.checkValidity(formEl.value, controls[inputIdentifier].validation);
    formEl.touched = true;
    controls[inputIdentifier] = formEl;
    const formIsValid = Object.keys(controls).reduce((res, key) => {
      return res && controls[key].valid;
    }, true);
    this.setState({ controls, formIsValid });
  }

  submitHandler = (event) => {
    event.preventDefault();
    this.props.onAuth(
      this.state.controls.email.value,
      this.state.controls.password.value,
      this.state.isSignup
    );
  }

  switchAuthModeHandler = () => {
    this.setState(prevState => {
      return {
        isSignup: !prevState.isSignup,
      };
    });
  }

  componentDidMount() {
    if (!this.props.building && this.props.authRedirectPath !== '/') {
      this.props.setAuthRedirectPath('/');
    }
  }

  render() {

    const formElementsArray = Object.keys(this.state.controls).map(key => {
      return (
        <Input
          key={key}
          elementType={this.state.controls[key].elementType}
          elementConfig={this.state.controls[key].elementConfig}
          changed={(event) => this.inputChangedHandler(event, key)}
          invalid={!this.state.controls[key].valid}
          touched={this.state.controls[key].touched}
          value={this.state.controls[key].value} />
      );
    });

    let form = (
      <form onSubmit={this.submitHandler}>
        {formElementsArray}
        <Button btnType="Success" disabled={!this.state.formIsValid}>SUBMIT</Button>
      </form>
    );

    if (this.props.loading) {
      form = <Spinner />
    }

    let errorMessage;
    if (this.props.error) {
      errorMessage = <p>{this.props.error.message}</p>
    }

    let content;

    if (this.props.isAuthenticated) {
      content = <Redirect to={this.props.authRedirectPath}/>
    } else {
      content = (
        <div className={classes.AuthData}>
          {errorMessage}
          {form}
          <Button 
            btnType="Danger"
            clicked={this.switchAuthModeHandler}>SWITCH TO { this.state.isSignup ? 'SIGNIN' : 'SIGNUP' }</Button>
        </div>
      );
    }

    return content;
  }
}

const mapStateToLoading = state => {
  return {
    loading: state.auth.loading,
    error: state.auth.error,
    isAuthenticated: state.auth.token != null,
    building: state.burgerBuilder.building,
    authRedirectPath: state.auth.authRedirectPath,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onAuth: (email, password, isSignup) => dispatch(actions.auth(email, password, isSignup)),
    onSetAuthRedirectPath: (path) => dispatch(actions.setAuthRedirectPath(path)),
  };
};

export default connect(mapStateToLoading, mapDispatchToProps)(Auth);