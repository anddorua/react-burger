import * as actionTypes from './actionTypes';
import axios from '../../axios-orders'

export const purchaseBurgesSuccess = (orderId, orderData) => {
  return {
    type: actionTypes.PURCHESE_BURGER_SUCCESS,
    orderId, 
    orderData,
  };
};

export const purchaseBurgesFail = (error) => {
  return {
    type: actionTypes.PURCHESE_BURGER_FAIL,
    error,
  };
};

export const purchaseBurgerStart = () => {
  return {
    type: actionTypes.PURCHESE_BURGER_START,
  };
};

export const purchaseBurger = (orderData) => {
  return dispatch => {
    dispatch(purchaseBurgerStart());
    axios.post('/orders.json', orderData)
      .then(response => {
        console.log(actionTypes.PURCHESE_BURGER_SUCCESS, response.data.name, orderData);
        dispatch(purchaseBurgesSuccess(response.data.name, orderData));
      })
      .catch(error => {
        console.log(actionTypes.PURCHESE_BURGER_FAIL, error);
        dispatch(purchaseBurgesFail(error));
      });
  };
};

export const purchaseInit = () => {
  return {
    type: actionTypes.PURCHESE_INIT,
  };
};

export const fetchOrdersSuccess = (orders) => {
  return {
    type: actionTypes.FETCH_ORDERS_SUCCESS,
    orders,
  };
};

export const fetchOrdersFail = (error) => {
  return {
    type: actionTypes.FETCH_ORDERS_FAIL,
    error,
  };
};

export const fetchOrdersStart = () => {
  return {
    type: actionTypes.FETCH_ORDERS_INIT,
  };
};

export const fetchOrders = () => {
  return dispatch => {
    dispatch(fetchOrdersStart());
    axios.get('/orders.json')
      .then(res => {
        const orders = res.data 
          ? Object.keys(res.data).map(key => ({ ...res.data[key], id: key }))
          : [];
        dispatch(fetchOrdersSuccess(orders));
      })
      .catch(err => {
        dispatch(fetchOrdersSuccess(err));
      });
  };
};
