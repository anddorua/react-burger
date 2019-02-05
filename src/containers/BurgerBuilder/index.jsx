import React, { Component } from 'react';
import Aux from '../../hoc/Aux';
import Burger from '../../components/Burger';
import BuildControls from '../../components/Burger/BuildControls';
import Modal from '../../containers/UI/Modal';
import OrderSummary from '../../components/Burger/OrderSummary';
import Spinner from '../UI/Spinner';
import axios from '../../axios-orders';
import withErrorHandler from '../../hoc/withErrorHandler';
import { connect } from 'react-redux';
import * as actions from '../../store/actions/index';


class BurgerBuilder extends Component {

  state = {
    purchasing: false,
    loading: false,
  };

  componentDidMount() {
    this.props.onInitIngredients();
  }

  _isPurchasable(ingredients) {
    return Object.keys(ingredients).reduce((res, item) => res || ingredients[item] > 0, false);
  }

  purchaseHandler() {
    if (this.props.isAuthenticated) {
      this.setState({ purchasing: true, });
    } else {
      this.props.onSetRedirectPath('/checkout');
      this.props.history.push('/auth');
    }
  }

  purchaseCancelHandler() {
    this.setState({ purchasing: false, });
  }

  purchaseContinueHandler() {
    this.props.onInitPurchase();
    this.props.history.push('/checkout');
  }

  render() {
    let orderSummary = null;
    let burger = this.props.error ? <p>Ingredients can't be loaded!</p> : <Spinner />;
    if (this.props.ings) {
      
      burger = <Aux>
        <Burger ingredients={this.props.ings}/>
        <BuildControls 
          ingredientAdded={this.props.onIngredientAdded}
          ingredientRemoved={this.props.onIngredientRemoved}
          ingredients={this.props.ings}
          purchasable={this._isPurchasable(this.props.ings)}
          price={this.props.price}
          ordered={this.purchaseHandler.bind(this)}
          isAuth={this.props.isAuthenticated}/>
      </Aux>;

      if (this.state.loading) {
        orderSummary = <Spinner />;
      } else {
        orderSummary = <OrderSummary
          ingredients={this.props.ings}
          price={this.props.price.toFixed(2)}
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

const mapStateToProps = (state) => {
  return {
    ings: state.burgerBuilder.ingredients,
    price: state.burgerBuilder.totalPrice,
    error: state.burgerBuilder.error,
    isAuthenticated: state.auth.token != null,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    onIngredientAdded: (ingredientName) => dispatch(actions.addIngredient(ingredientName)),
    onIngredientRemoved: (ingredientName) => dispatch(actions.removeIngredient(ingredientName)),
    onInitIngredients: () => dispatch(actions.initIngredients()),
    onInitPurchase: () => dispatch(actions.purchaseInit()),
    onSetRedirectPath: (path) => dispatch(actions.setAuthRedirectPath(path)),
  };
} 

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));