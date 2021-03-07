import React, {Component} from 'react';
import {Route, Switch, Redirect} from 'react-router-dom';

import Land from './container/Land';
import Home from './container/Home';
import Login from './container/Login';
import AdminMain from './container/Admin/main';
import AdminAgentReg from './container/Admin/agentReg';
import AdminAgentApplication from './container/Admin/agentApplication';
import AdminAgentRegInfo from './container/Admin/agentRegInfo';
import AdminAgentSearch from './container/Admin/agentSearch';
import AdminAgentSaleSearch from './container/Admin/agentSaleSearch';
import AdminAgentCompensation from './container/Admin/agentCompensation';
import AdminNoticeEdit from './container/Admin/gotipManange/noticEdit';
import AdminUserManage from './container/Admin/gotipManange/userManage';

import AdminCreatorReg from './container/Admin/creator/creatorReg';

import Main from './container/Main';
import OtherView from './container/OtherView';
import UserEdit from './container/UserEdit';
import Company from './container/Company';
import Terms from './container/Terms';
import Privacy from './container/Privacy';
import Contact from './container/Contact';
import SignUp from './container/Signup';
import RegStep from './container/RegStep';
import RegFan from './container/RegFan';
import Registration from  './container/Registration';

class App extends Component {
  constructor(props) {
    super(props);

  }
  
  render() {
    const PrivateRoute = ({ component: Component, ...rest }) => {
      const isLoggedin = localStorage.getItem('isLoggedin');
      const check = localStorage.getItem('check');
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
            <PrivateRoute path="/admin/top/news" exact component={AdminMain} />
            <PrivateRoute path="/admin/agent/register" exact component={AdminAgentReg} />
            <PrivateRoute path="/admin/agent/application" exact component={AdminAgentApplication} />
            <Route path="/admin/agent/registration/:agentId" exact component={AdminAgentRegInfo} />
            <PrivateRoute path="/admin/agent/searchAgent" exact component={AdminAgentSearch} />
            <PrivateRoute path="/admin/agent/saleSearch" exact component={AdminAgentSaleSearch} />
            <PrivateRoute path="/admin/agent/compensation" exact component={AdminAgentCompensation} />

            <PrivateRoute path="/admin/creator/register" exact component={AdminCreatorReg} />
            <PrivateRoute path="/admin/creator/searchCreator" exact component={AdminCreatorReg} />
            <PrivateRoute path="/admin/creator/onlineCreator" exact component={AdminCreatorReg} />
            <PrivateRoute path="/admin/creator/saleCreator" exact component={AdminCreatorReg} />
            <PrivateRoute path="/admin/creator/compensation" exact component={AdminCreatorReg} />
            <PrivateRoute path="/admin/creator/dailySale/:timestamp" exact component={AdminCreatorReg} />
            <PrivateRoute path="/admin/creator/personalSale/:uid" exact component={AdminCreatorReg} />

            <PrivateRoute path="/admin/management/noticeEdit" exact component={AdminNoticeEdit} />
            <PrivateRoute path="/admin/management/userManage" exact component={AdminUserManage} />

            <PrivateRoute path="/main" exact component={Main} />
            <Route path="/main/:uid" exact component={OtherView} />
            <PrivateRoute path="/useredit" exact component={UserEdit} /> 
            <PrivateRoute path="/contact" exact component={Contact} /> 
            <PrivateRoute path="/home" exact component={Home} />
            <PrivateRoute path="/regCreator" exact component={RegStep} />
            <PrivateRoute path="/regCreator/:agentID" exact component={RegStep} />
            <PrivateRoute path="/regFan" exact component={RegFan} />
            <Route path="/registration" exact component={Registration} />
            <Route path="/company" exact component={Company} /> 
            <Route path="/terms" exact component={Terms} /> 
            <Route path="/privacy" exact component={Privacy} /> 
            <Route path="/signup" exact component={SignUp} />
            <Route path="/signup/:agentID" exact component={SignUp} />
            <Route path="/land" exact component={Land} />
            <Route path="/:login" exact component={Land} />
            <Route path="/" exact component={Land} />
          </Switch>
      </div>
    );
  }
}

export default  App;