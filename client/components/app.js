import React from "react";
import TopNavBar from "./top-navbar";
import Login from "./login";
import ReactDOM from "react-dom";
import {Router, Route, IndexRoute, hashHistory, RouterContext} from "react-router";
import {Link} from "react-router";


class App extends React.Component{

	

	setUser(user) {
		console.log("[setting the user]");
		this.setState({user: user});
	}

	getUser(user) {
		console.log("[getting the user]");
		return this.state.user;
	}

	getChildContext() {
		return {
			getUser: this.getUser.bind(this),
			setUser: this.setUser.bind(this)
		}
	}

	constructor(props) {
		super(props);

		this.state = {
			user: {}
		};
	}
	componentWillMount(){
		$.ajax({
			url: '/checkLoggedIn',
			dataType: 'json',
			type: 'GET',
			success: function(resp){
				if (resp.authenticated){
					sessionStorage.auth=true}
			this.context.router.push('/');
		}.bind(this),
			error: function(err){
				console.log("error",err)
			}
		})
	}

	render() {
		return (
			<div className="app">
				<TopNavBar />
					{React.Children.map(this.props.children, function(child) {
						return React.cloneElement(child);
					}.bind(this))}

			</div>

		);
	}
}
App.contextTypes = {
    router: React.PropTypes.object.isRequired
};


App.childContextTypes = {
    getUser: Object,
    setUser: Object
}
export default App;
