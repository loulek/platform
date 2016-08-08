import React from "react";
import TopNavBar from "./top-navbar";
import Login from "./login";
import ReactDOM from "react-dom";
import {Router, Route, IndexRoute, hashHistory, RouterContext} from "react-router";
import {Link} from "react-router";


class App extends React.Component{

	constructor(props) {
		super(props);
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
				<div className="container">
					{React.Children.map(this.props.children, function(child) {
						return React.cloneElement(child);
					}.bind(this))}
				</div>

			</div>

		);
	}
}
App.contextTypes = {
    router: React.PropTypes.object.isRequired
};

export default App;
