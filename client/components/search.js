import React from "react"
import Router from "react-router";
import {Link} from "react-router";

var Search = React.createClass({
  getInitialState(){
    return {
      list: []
    }
  },

  componentDidMount(){
    var address="philadelphia";
    console.log("ADDRESSS HERE", address)
    $.ajax({
      url: '/user/find',
      dataType: 'json',
      type: 'POST',
      data: {address:address},
      success: function(data) {
        console.log("success finding users", data)
      },
      error: function(err){
        console.log(err)
      }

    });
  },

	render() {


		return(
      <div>
			"SOMETHING"
      </div>
		);



}
})



export default Search;
