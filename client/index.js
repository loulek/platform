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
import Trips from "./components/account/trips";
import Calendar from "./components/calendar";
import Search from "./components/search";
import Events from "./components/event";
import Profile from "./components/profile";
import CreateEvent from "./components/CreateEvent";
import WorkerSignup from "./components/WorkerSignup";
import EventProfile from "./components/EventProfile";
import Forgot from "./components/forgot";
import Change from "./components/change";
import Notifications from "./components/notifications";
import Messages from "./components/messages";
import MessageUser from "./components/message_user";
import Art from "./components/art";


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
        <Route path="/events" component={Events}/>
        <Route path="/notifications" component={Notifications}/>
        <Route path="/conversation/:id" component={MessageUser}/>
        <Route path="/messages" component={Messages}/>
        <Route path="/event/:id" component={EventProfile}/>
        <Route path="/profile" component={Profile}/>
        <Route path="/profile/:id" component={Profile}/>
        <Route path="/art/:id" component={Art}/>
	    	<Route path="/login" component={Login} />
	    	<Route path="/signup" component={Signup} />
        <Route path="workersignup" component={WorkerSignup} />
        <Route path="/forgot" component={Forgot} />
        <Route path="/account" component={Account} onEnter={requireAuth}>
          <IndexRoute component={AccountInfo} />
          <Route path="/account/edit-profile" component={EditProfile} onEnter={requireAuth} />
          <Route path="/account/edit-notifications" component={EditNotifications} onEnter={requireAuth} />
          <Route path="/account/change-password" component={ChangePassword} onEnter={requireAuth} />
          <Route path="/account/trips" component={Trips} onEnter={requireAuth} />
        </Route>
        <Route path="/calendar" component={Calendar} />
        <Route path="/search" component={Search}>
          <Route path="/search/:id" component={Search}/>
        </Route>
    	</Route>
      <Route path="/change/:id" component={Change} />
    </Router>
    ,
    document.getElementById('root')
  );
}

render();
