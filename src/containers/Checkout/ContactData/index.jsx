import React, { Component } from 'react';
import axios from '../../../axios-orders';
import Button from '../../UI/Button';
import Spinner from '../../UI/Spinner';
import classes from './ContactData.css';

export default class ContactData extends Component {

  state = {
    name: '',
    email: '',
    address: {
      street: '',
      postalCode: '',
    },
    loading: false,
  };

  orderHandler = (event) => {
    event.preventDefault();
    this.setState({ loading: true, });
    const order = {
      ingredients: this.props.ingredients,
      price: this.props.price,
      customer: {
        name: 'Ant Man',
        address: {
          street: 'Test street 2',
          zipCode: '12345',
          country: 'Ukraine',
        },
        email: 'test@test.com',
      },
      deliveryMethod: 'fastest',
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

  render() {
    let form = (
      <form>
        <input type="text" className={classes.Input} name="name" placeholder="Your name" />
        <input type="text" className={classes.Input} name="email" placeholder="Your email" />
        <input type="text" className={classes.Input} name="street" placeholder="Street" />
        <input type="text" className={classes.Input} name="postal" placeholder="PostalCode" />
        <Button btnType="Success" clicked={this.orderHandler}>ORDER</Button>
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
