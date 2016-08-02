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

		var guestContent = <div><CreateEvent /></div>;


		var userContent = <div>
							<h3 style={{"color":"white"}}>Bienvenue</h3>
							
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
