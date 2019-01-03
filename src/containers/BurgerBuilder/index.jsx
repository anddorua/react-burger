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
import * as actionTypes from '../../store/actions';


class BurgerBuilder extends Component {

  state = {
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
    this.props.history.push('/checkout');
  }

  render() {
    let orderSummary = null;
    let burger = this.state.error ? <p>Ingredients can't be loaded!</p> : <Spinner />;
    if (this.props.ings) {
      
      burger = <Aux>
        <Burger ingredients={this.props.ings}/>
        <BuildControls 
          ingredientAdded={this.props.onIngredientAdded}
          ingredientRemoved={this.props.onIngredientRemoved}
          ingredients={this.props.ings}
          purchasable={this._isPurchasable(this.props.ings)}
          price={this.props.price}
          ordered={this.purchaseHandler.bind(this)}/>
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
    ings: state.ingredients,
    price: state.totalPrice,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    onIngredientAdded: (ingredientName) => dispatch({ type: actionTypes.ADD_INGREDIENT, ingredientName }),
    onIngredientRemoved: (ingredientName) => dispatch({ type: actionTypes.REMOVE_INGREDIENT, ingredientName }),
  };
} 

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));