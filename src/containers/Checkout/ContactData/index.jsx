import React, { Component } from 'react';
import axios from '../../../axios-orders';
import Button from '../../UI/Button';
import Spinner from '../../UI/Spinner';
import Input from '../../UI/Input';
import classes from './ContactData.css';

export default class ContactData extends Component {

  state = {
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
          minLength: 5,
          maxLength: 5,
        },
        valid: false,
        touched: false,
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
      },
      deliveryMethod: {
        elementType: 'select',
        elementConfig: {
          options: [
            { value: 'fastest', displayValue: 'Fastest' },
            { value: 'cheapest', displayValue: 'Cheapest' },
          ],
        },
        value: '',
        valid: true,
        touched: false,
      },
    },
    formIsValid: false,
    loading: false,
  };

  orderHandler = (event) => {
    event.preventDefault();
    this.setState({ loading: true, });
    const orderData = Object.keys(this.state.orderForm).reduce((res, key) => {
      res[key] = this.state.orderForm[key].value;
      return res;
    }, {});
    const order = {
      ingredients: this.props.ingredients,
      price: this.props.price,
      orderData,
    };
    axios.post('/orders.json', order)
      .then(response => {
        this.setState({ loading: false });
        this.props.history.push('/');
      })
      .catch(error => {
        console.log(error);
        this.setState({ loading: false });
      });
  }

  inputChangedHandler = (event, inputIdentifier) => {
    const orderForm = {
      ...this.state.orderForm,
    }
    const formEl = {
      ...orderForm[inputIdentifier],
    };
    formEl.value = event.target.value;
    formEl.valid = this.checkValidity(formEl.value, orderForm[inputIdentifier].validation);
    formEl.touched = true;
    orderForm[inputIdentifier] = formEl;
    const formIsValid = Object.keys(orderForm).reduce((res, key) => {
      return res && orderForm[key].valid;
    }, true);
    this.setState({ orderForm, formIsValid });
  }

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

  render() {
    const formElementsArray = Object.keys(this.state.orderForm).map(key => {
      return (
        <Input
          key={key}
          elementType={this.state.orderForm[key].elementType}
          elementConfig={this.state.orderForm[key].elementConfig}
          changed={(event) => this.inputChangedHandler(event, key)}
          invalid={!this.state.orderForm[key].valid}
          touched={this.state.orderForm[key].touched}
          value={this.state.orderForm[key].value} />
      );
    });
    let form = (
      <form onSubmit={this.orderHandler}>
        {formElementsArray}
        <Button btnType="Success" disabled={!this.state.formIsValid}>ORDER</Button>
      </form>
    ); 

    if (this.state.loading) {
      form = <Spinner />;
    }

    return (
      <div className={classes.ContactData}>
        <h4>Enter Your Contact Data!</h4>
        {form}
      </div>
    )
  }
}
