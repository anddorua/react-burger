import React, { Component } from 'react';
import { connect } from 'react-redux';
import Aux from '../../hoc/Aux';
import Toolbar from '../Navigation/Toolbar';
import classes from './Layout.css';
import SideDrawer from '../Navigation/SideDrawer';

class Layout extends Component {

  state = {
    showSideDrawer: true,
  };

  sideDrawerClosedHandler = () => {
    this.setState({ showSideDrawer: false });
  }

  sideDrawerToggleHandler = () => {
    this.setState((prevState) => ({
      showSideDrawer: !prevState.showSideDrawer,
    }));
  }

  render() {
    return (
      <Aux>
        <Toolbar 
          drawerToggleClicked={this.sideDrawerToggleHandler}
          isAuth={this.props.isAuthenticated}/>
        <SideDrawer 
          open={this.state.showSideDrawer} 
          closed={this.sideDrawerClosedHandler}
          isAuth={this.props.isAuthenticated}/>
        <main className={classes.Content}>{this.props.children}</main>
      </Aux>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.auth.token != null,
  };
}

export default connect(mapStateToProps)(Layout);