import React from "react";
import TopNavBar from "./top-navbar";
import Login from "./login";

class App extends React.Component{

	constructor(props) {
		super(props);
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
};

export default App;