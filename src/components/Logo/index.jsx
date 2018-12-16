import React from 'react';
import burgerLogo from '../../assets/images/burger-logo.png'
import classes from './Logo.css';

export default (props) => (
  <div className={classes.Logo}>
    <img src={burgerLogo} alt="MyBurger"/>
  </div>
);