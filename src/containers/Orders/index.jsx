import React, { Component } from 'react';
import Order from '../../components/Order';
import axios from '../../axios-orders';
import withErrorHandler from '../../hoc/withErrorHandler';

class Orders extends Component {
 
  state = {
    orders: [],
    loading: true,
  };

  componentDidMount() {
    axios.get('/orders.json')
      .then(res => {
        const orders = Object.keys(res.data).map(key => ({ ...res.data[key], id: key }));
        this.setState({ orders, loading: false });
      })
      .catch(err => {
        this.setState({ loading: false });
      });

  }

  render() {
    return (
      <div>
        {this.state.orders.map(order => (
          <Order 
            key={order.id}
            ingredients={order.ingredients}
            price={order.price}/>
        ))}
      </div>
    )
  }
}

export default withErrorHandler(Orders, axios);