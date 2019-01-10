import * as actionTypes from '../actions/actionTypes';

const initialState = {
  loading: false,
  orders: [],
  purchased: false,
};

const reducer = (state = initialState, action) => {
  switch(action.type) {
    case actionTypes.PURCHESE_INIT:
      return {
        ...state,
        purchased: false,
      };
    case actionTypes.PURCHESE_BURGER_START:
      return {
        ...state,
        loading: true,
      };
    case actionTypes.PURCHESE_BURGER_SUCCESS:
      const newOrder = {
        ...action.orderData,
        id: action.orderId,
      };
      return {
        ...state,
        loading: false,
        orders: state.orders.concat(newOrder),
        purchased: true,
      };
    case actionTypes.PURCHESE_BURGER_FAIL:
      return {
        ...state,
        loading: false,
      };
    case actionTypes.FETCH_ORDERS_INIT:
      return {
        ...state,
        loading: true,
      };
    case actionTypes.FETCH_ORDERS_SUCCESS:
      return {
        ...state,
        loading: false,
        orders: action.orders,
        error: null,
      };
    case actionTypes.FETCH_ORDERS_FAIL:
      return {
        ...state,
        loading: false,
        error: action.error,
      };
    default:
      return state;
  }
}

export default reducer;