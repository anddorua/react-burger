import React from 'react';
import classes from './Modal.css';
import Aux from '../../../hoc/Aux';
import Backdrop from '../Backdrop';

export default (props) => (
  <Aux>
    <Backdrop show={props.show} clicked={props.modalClosed}></Backdrop>
    <div 
      className={classes.Modal}
      style={{
        transform: props.show ? 'translateY(0)' : 'translateY(-100vh)',
        opacity: props.show ? '1' : '0'
      }}>
      {props.children}
    </div>
  </Aux>
);