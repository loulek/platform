import React from "react";
import ReactDOM from "react-dom";
import {Router, Route, IndexRoute, hashHistory} from "react-router";

import App from "./components/app";
import Home from "./components/home";
import Signup from "./components/signup";
import Login from "./components/login";
import Account from "./components/account/account";
import AccountInfo from "./components/account/account-info";
import EditProfile from "./components/account/edit-profile";
import EditNotifications from "./components/account/edit-notifications";
import ChangePassword from "./components/account/change-password";
import Calendar from "./components/calendar";
import Search from "./components/search";
function requireAuth(nextState, replace) {
  if(sessionStorage.auth === "false") {
    replace({
      pathname: '/login',
      state: { nextPathname: nextState.location.pathname }
    })
  }
}

function render() {
  ReactDOM.render(
    <Router history={hashHistory}>
    	<Route path="/" component={App}>
	    	<IndexRoute component={Home}></IndexRoute>
	    	<Route path="/login" component={Login} />
	    	<Route path="/signup" component={Signup} />
        <Route path="/account" component={Account} onEnter={requireAuth}>
          <IndexRoute component={AccountInfo} />
          <Route path="/account/edit-profile" component={EditProfile} onEnter={requireAuth} />
          <Route path="/account/edit-notifications" component={EditNotifications} onEnter={requireAuth} />
          <Route path="/account/change-password" component={ChangePassword} onEnter={requireAuth} />
        </Route>
        <Route path="/calendar" component={Calendar} />
        <Route path="/search/:address" component={Search}/>
    	</Route>
    </Router>
    ,
    document.getElementById('root')
  );
}

render();
