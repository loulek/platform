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
				<h2>{this.state.user.salary}€/heure</h2>
				<img src={this.state.user.profileImageUrl} alt="Image" width="150px"/>
				<button className="btn btn-success">Contact</button>

			</div>
		);
	}
}


export default Profile;