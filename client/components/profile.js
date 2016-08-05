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


handleClick(e){
	e.preventDefault();
	var num=this.state.user.phone
	console.log("thisclick", this.props)
	$.ajax({
		url: '/contact',
		dataType: 'json',
		type: 'POST',
		data: {
			num:num,
			message: "hi"},
		success: function(resp){
			console.log("resp from twilio", resp)
			if (resp.success){
				alert("success!")
			}
		},
		error: function(err){
			console.log("error",err)
		}
	})
}

	render() {
		return (
			<div>
				<h3>Profile</h3>
				<h2>{this.state.user.firstName} {this.state.user.lastName}</h2>
				<h2>{this.state.user.salary}€/heure</h2>
				<img src={this.state.user.profileImageUrl} alt="Image" width="150px"/>
				<button className="btn btn-success" onClick={this.handleClick.bind(this)}>Contact</button>

			</div>
		);
	}
}


export default Profile;
