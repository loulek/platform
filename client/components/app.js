import React from "react";
// import oneOf from React;
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
					sessionStorage.auth = true;
					this.setUser(resp.user);
					console.log("HELLOO I AM CHECKING IF I AM A PROFILE OR A CLIENT")
					if (resp.user.type === "Client"){
						this.context.router.push('/');
					}
					if (resp.user.type === "Profile"){
						this.context.router.push("/account");
					}

				} else {
					sessionStorage.auth = false
					this.context.router.push("/")
				}

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
    getUser: React.PropTypes.oneOfType([() => {}]),
    setUser: React.PropTypes.oneOfType([() => {}]),
}
export default App;
