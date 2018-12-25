import React from 'react';
import classes from './Order.css';

export default (props) => {
  let ingredients = Object
    .keys(props.ingredients)
    .map(key => ({
      name: key,
      amount: props.ingredients[key],
    }))
    .map(ig => (
      <span 
        key={ig.name}
        style={{
          textTransform: 'capitalize',
          display: 'inline-block',
          margin: '0 8px',
          border: '1px solid #ccc',
          padding: '5px',
        }}>
        {ig.name} ({ig.amount})
      </span>
    ));
  return (
    <div className={classes.Order}>
      <p>Ingredients: {ingredients}</p>
      <p>Price: <strong>USD {(+props.price).toFixed(2)}</strong></p>
    </div>
  );
};