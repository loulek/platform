import React from "react"
import Router from "react-router";
import {Link} from "react-router";
import Geosuggest from 'react-geosuggest';
import LandingEvent from './LandingEvent'

class App extends React.Component {

	constructor(props) {
		super(props);
	}

	render() {

		var guestContent = <div><LandingEvent /></div>;


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
