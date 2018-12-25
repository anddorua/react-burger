import React, { Component } from 'react';
import Aux from '../../hoc/Aux';
import Burger from '../../components/Burger';
import BuildControls from '../../components/Burger/BuildControls';
import Modal from '../../containers/UI/Modal';
import OrderSummary from '../../components/Burger/OrderSummary';
import Spinner from '../UI/Spinner';
import axios from '../../axios-orders';
import withErrorHandler from '../../hoc/withErrorHandler';
import { withRouter } from "react-router-dom";

const INGREDIENT_PRICES = {
  salad: 0.5,
  cheese: 0.4,
  meat: 1.3,
  bacon: 0.7,
};

class BurgerBuilder extends Component {

  state = {
    ingredients: null,
    totalPrice: 4,
    purchasable: false,
    purchasing: false,
    loading: false,
    error: false,
  };

  componentDidMount() {
    axios
      .get('/ingredients.json')
      .then(response => {
        this.setState({ ingredients: response.data });
      })
      .catch(error => {
        this.setState({ error: true, });
      });
  }

  addIngredientHandler(type) {
    const ingredients = {
      ...this.state.ingredients,
      [type]: this.state.ingredients[type] + 1
    };
    this.setState({
      ingredients,
      totalPrice: this.state.totalPrice + INGREDIENT_PRICES[type],
      purchasable: true,
    })
  }

  removeIngredientHandler(type) {
    if (this.state.ingredients[type] > 0) {
      const ingredients = {
        ...this.state.ingredients,
        [type]: this.state.ingredients[type] - 1,
      };
      this.setState({
        ingredients,
        totalPrice: this.state.totalPrice - INGREDIENT_PRICES[type],
        purchasable: this._isPurchasable(ingredients),
      })
    }
  }

  _isPurchasable(ingredients) {
    return Object.keys(ingredients).reduce((res, item) => res || ingredients[item] > 0, false);
  }

  purchaseHandler() {
    this.setState({ purchasing: true, });
  }

  purchaseCancelHandler() {
    this.setState({ purchasing: false, });
  }

  purchaseContinueHandler() {
    const queryParams = Object.keys(this.state.ingredients).reduce((params, key) => {
      return [...params, `${encodeURIComponent(key)}=${encodeURIComponent(this.state.ingredients[key])}`];
    }, [
      `price=${this.state.totalPrice}`
    ]);
    this.props.history.push({
      pathname: '/checkout',
      search: '?' + queryParams.join('&'),
    });
  }

  render() {
    let orderSummary = null;
    let burger = this.state.error ? <p>Ingredients can't be loaded!</p> : <Spinner />;
    if (this.state.ingredients) {
      
      burger = <Aux>
        <Burger ingredients={this.state.ingredients}/>
        <BuildControls 
          ingredientAdded={this.addIngredientHandler.bind(this)}
          ingredientRemoved={this.removeIngredientHandler.bind(this)}
          ingredients={this.state.ingredients}
          purchasable={this.state.purchasable}
          price={this.state.totalPrice}
          ordered={this.purchaseHandler.bind(this)}/>
      </Aux>;

      if (this.state.loading) {
        orderSummary = <Spinner />;
      } else {
        orderSummary = <OrderSummary
          ingredients={this.state.ingredients}
          price={this.state.totalPrice.toFixed(2)}
          purchaseCanceled={this.purchaseCancelHandler.bind(this)}
          purchaseContinued={this.purchaseContinueHandler.bind(this)}/>
      }
    }

    return (
      <Aux>
        <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler.bind(this)}>
          {orderSummary}
        </Modal>
        {burger}
      </Aux>
    );
  }
}

export default withRouter(withErrorHandler(BurgerBuilder, axios));