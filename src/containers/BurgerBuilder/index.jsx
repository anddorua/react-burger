import React, { Component } from 'react';
import Aux from '../../hoc/Aux';
import Burger from '../../components/Burger';
import BuildControls from '../../components/Burger/BuildControls';
import Modal from '../../containers/UI/Modal';
import OrderSummary from '../../components/Burger/OrderSummary';

const INGREDIENT_PRICES = {
  salad: 0.5,
  cheese: 0.4,
  meat: 1.3,
  bacon: 0.7,
};

export default class BurgerBuilder extends Component {

  state = {
    ingredients: {
      salad: 0,
      bacon: 0,
      cheese: 0,
      meat: 0,
    },
    totalPrice: 4,
    purchasable: false,
    purchasing: false,
  };

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
    console.log('Continue');
  }

  render() {
    return (
      <Aux>
        <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler.bind(this)}>
          <OrderSummary
            ingredients={this.state.ingredients}
            price={this.state.totalPrice.toFixed(2)}
            purchaseCanceled={this.purchaseCancelHandler.bind(this)}
            purchaseContinued={this.purchaseContinueHandler.bind(this)}/>
        </Modal>
        <Burger ingredients={this.state.ingredients}/>
        <BuildControls 
          ingredientAdded={this.addIngredientHandler.bind(this)}
          ingredientRemoved={this.removeIngredientHandler.bind(this)}
          ingredients={this.state.ingredients}
          purchasable={this.state.purchasable}
          price={this.state.totalPrice}
          ordered={this.purchaseHandler.bind(this)}/>
      </Aux>
    );
  }
}