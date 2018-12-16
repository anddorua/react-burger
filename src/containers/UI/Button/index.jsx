import React from 'react';
import classes from './Button.css';

export default (props) => (
  <button 
    className={[classes.Button, classes[props.btnType]].join(' ')}
    onClick={props.clicked}>{props.children}</button>
);