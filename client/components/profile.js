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

	handleClick(e){
		e.preventDefault();
		var num=this.state.user.phone
		console.log("thisclick", this)
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

	sendmessage(e){
		e.preventDefault();
		$.ajax({
			url: '/sendMessage',
			dataType: 'json',
			type: 'POST',
			data: this.state,
				success: function(data) {
					if(data.success === true) {
						this.context.router.push(data.redirect);
					} else if(data.status === 'error') {
						this.setState({
							message: data.error
						});
					}
				}.bind(this),
				error: function(hello, status, err){
					this.setState({
						message: "Error sending a message"
					});
				}.bind(this)
		});
	}

	render() {
		if (this.state.user.specialty){
			console.log("thisthsi",this)
			var languages = this.state.user.specialty.join(', ')
		}
		return (
			<div className="container">
				<div className="panel panel-default">
					<div className='panel-heading'>
						<h3 className="panel-title">Profile</h3>
					</div>
						<div className='panel-body'>
							<div className='form-group row'>
								<div className="squaresContainer">	
									<div className="row col-md-4"><img src={this.state.user.profileImageUrl} alt="Image" width="150px"/>
									</div>
									<div className="row col-md-5">
									<h3>Name: {this.state.user.firstName} {this.state.user.lastName}</h3>
										<h4>Gender: {this.state.user.gender}</h4>
									</div>
									<div className="row col-md-10">
										<h4>Languages: {languages}</h4>
										<h4>Phone: {this.state.user.phone}</h4>
										<h4>Salary: {this.state.user.salary}$/hour</h4>
										<iframe src={this.state.user.resumeImageUrl} alt="Image"/>
									</div>
								  <button className="btn btn-success" onClick={this.sendmessage.bind(this)}>Send message</button>
								</div>
							</div>
						</div>	
				</div>
			</div>
		);
	}
}

Profile.contextTypes = {
  router: Object
}

module.exports = Profile;