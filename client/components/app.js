import React from "react";
import TopNavBar from "./top-navbar";
import Login from "./login";
import ReactDOM from "react-dom";
import {Router, Route, IndexRoute, hashHistory, RouterContext} from "react-router";



class App extends React.Component{

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="app">
				<TopNavBar />
				<h1> lANDING PAAGE</h1>
				<div className="container">
					{React.Children.map(this.props.children, function(child) {
						return React.cloneElement(child);
					}.bind(this))}
				</div>

			</div>

		);
	}
}

export default App;
