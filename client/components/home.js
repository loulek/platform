import React from "react"
import Router from "react-router";
import {Link} from "react-router";
import Geosuggest from 'react-geosuggest';
import CreateEvent from './CreateEvent.js'

class App extends React.Component {

	constructor(props) {
		super(props);
	}

	render() {

		var guestContent = <div><h3>Viewing page as guest</h3><CreateEvent /></div>;


		var userContent = <div>
							<h3>Bienvenue</h3>
							<hr />
							
						  </div>;

		var content = null;
		if(sessionStorage.auth === "true"){
			content = userContent;
		} else {
			content = guestContent;
		}

		return(
			content
		);
	}

}




export default App;
