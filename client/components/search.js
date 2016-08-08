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

    var queryParams = this.props.location.query;
    console.log("The search page got these query", queryParams);

    var guestContent = <div><CreateEvent address={queryParams.address} startDate={queryParams.startDate} endDate={queryParams.endDate} /></div>;


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


