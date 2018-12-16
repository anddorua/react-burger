import React from 'react';
import classes from './SideDrawer.css';
import Logo from '../../Logo';
import NavigationItems from '../NavigationItems';
import Backdrop from '../../../containers/UI/Backdrop';
import Aux from '../../../hoc/Aux';

export default (props) => {
  let attachedClasses = [classes.SideDrawer, classes.Close];
  if (props.open) {
    attachedClasses = [classes.SideDrawer, classes.Open];
  }
  return (
    <Aux>
      <Backdrop show={props.open} clicked={props.closed}/>
      <div className={attachedClasses.join(' ')}>
        <div className={classes.Logo}>
          <Logo />
        </div>
        <nav>
          <NavigationItems />
        </nav>
      </div>
    </Aux>
  );
};
