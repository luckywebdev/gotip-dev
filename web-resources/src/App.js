import React, {Component} from 'react';
import {Route, Switch, Redirect} from 'react-router-dom';

import Home from './container/Home';
import Login from './container/Login';
import Main from './container/Main';
import UserEdit from './container/UserEdit';
import Company from './container/Company';
import Terms from './container/Terms';
import Privacy from './container/Privacy';
import Contact from './container/Contact';
import SignUp from './container/Signup';


class App extends Component {
  constructor(props) {
    super(props);

  }
  
  render() {
    const PrivateRoute = ({ component: Component, ...rest }) => {
      const isLoggedin = localStorage.getItem('isLoggedin');
      return (
        <Route {...rest} render={(props) => (
          isLoggedin === "true"
            ? <Component {...props}/>
            : <Redirect to={{
                pathname: '/'
              }} />
        )} />
      )
    }
    return (
      <div>
          <Switch>
            <PrivateRoute path="/main" exact component={Main} />
            <PrivateRoute path="/useredit" exact component={UserEdit} /> 
            <Route path="/company" exact component={Company} /> 
            <Route path="/terms" exact component={Terms} /> 
            <Route path="/privacy" exact component={Privacy} /> 
            <PrivateRoute path="/contact" exact component={Contact} /> 
            <Route path="/signup" exact component={SignUp} />
            <Route path="/home" exact component={Home} />
            <Route path="/:login" exact component={Home} />
            <Route path="/" exact component={Home} />
          </Switch>
      </div>
    );
  }
}

export default  App;