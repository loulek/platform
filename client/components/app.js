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
					{React.Children.map(this.props.children, function(child) {
						return React.cloneElement(child);
					}.bind(this))}

			</div>

		);
	}
}

export default App;
