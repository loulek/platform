import React from "react";
import {Link} from "react-router";

class Profile extends React.Component {
	constructor(props) {
		super(props);
		this.state={
		user:{}
	}
	}
	

	componentDidMount() {
	console.log("YOOOOOOOOOOOOOOOOOOOOOooooooooooOOOoooooOOoooOOoooOOooO", this.props.params)

    $.ajax({
      url: '/profile/' + this.props.params.id,
      dataType: 'json',
      type: 'GET',	
      success: function(user) {
        console.log("success finding users", user)
        this.setState({
			user: user.user
		})
      }.bind(this),
      error: function(err){
        console.log(err,"hereeeee")
      }

    });
  }

	render() {
		return (
			<div>
				<h3>Profile</h3>
				<h2>{this.state.user.firstName} {this.state.user.lastName}</h2>
				<h2>{this.state.user.salary}</h2>
			</div>
		);
	}
}


export default Profile;