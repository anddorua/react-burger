import React from 'react';
import classes from './Burger.css';
import BurgerIngredient from './BurgerIngredient';

const burger = (props) => {
  let transformedIngredients = Object.keys(props.ingredients).map(igKey => {
    const result = [...Array(props.ingredients[igKey])]
      .map((_, i) => { 
        return <BurgerIngredient key={igKey + i} type={igKey}/>;
      })
    return result;
  }).reduce((arr, value) => [...arr, ...value], []);
  if (transformedIngredients.length === 0) {
    transformedIngredients = <p>Please start adding ingredients!</p>
  }
  return (
    <div className={classes.Burger}>
      <BurgerIngredient type="bread-top"/>
      { transformedIngredients }
      <BurgerIngredient type="bread-bottom"/>
    </div>
  );
};

export default burger;