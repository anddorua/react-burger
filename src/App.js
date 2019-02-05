import React, { Component } from 'react';
import { Route, Switch, withRouter, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import Layout from './components/Layout';
import BurgerBuilder from './containers/BurgerBuilder';
import Checkout from './containers/Checkout';
import Orders from './containers/Orders';
import Auth from './containers/Auth';
import Logout from './containers/Auth/Logout';
import { authCheckState } from './store/actions';

class App extends Component {

  componentDidMount() {
    this.props.onTryAutoSignup();
  }

  render() {

    let routes;
    if (this.props.isAuthenticated) {
      routes = (
        <Switch>
          <Route path="/checkout" component={Checkout}/>
          <Route path="/orders" component={Orders}/>
          <Route path="/logout" component={Logout}/>
          <Route path="/" exact component={BurgerBuilder}/>
          <Redirect to="/" />
        </Switch>
      );
    } else {
      routes = (
        <Switch>
          <Route path="/auth" component={Auth}/>
          <Route path="/" exact component={BurgerBuilder}/>
          <Redirect to="/" />
        </Switch>
      );
    }

    return (
      <Layout>
        {routes}
      </Layout>
    );
  }
}

const mapStateToProps = state => {
  return {
    isAuthenticated: state.auth.token != null,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onTryAutoSignup: () => dispatch(authCheckState()), 
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
