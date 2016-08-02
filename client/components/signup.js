import React from "react";
import Router from "react-router";
import {Link} from "react-router";

class Signup extends React.Component {

	constructor() {
		super();

		this.state = {
			email: null,
			password: null,
			repeatPassword: null,
			message: null,
			type: 'Profile'
		};
	}

	signup(e) {
		e.preventDefault();
		if(!this.state.email) {
			return this.setState({
				message: 'Email is required.'
			});
		}

		if(!this.state.password) {
			return this.setState({
				message: 'Password is required.'
			});
		}

		if(!this.state.repeatPassword) {
			return this.setState({
				message: 'Repeat password is required.'
			});
		}

		if(this.state.password !== this.state.repeatPassword) {
			return this.setState({
				message: "Passwords doesn't match"
			});
		}

		$.ajax({
			url: '/signup',
			dataType: 'json',
			type: 'POST',
			data: this.state,
			success: function(data) {
				if(data.status === 'ok') {
					sessionStorage.auth = true;
					this.context.router.push('/');
				} else if(data.status === 'error') {
					this.setState({
						message: data.error
					});
				}
			}.bind(this),
			error: function(xhr, status, err) {
				console.log(err)
			}.bind(this)
		});
	}

	emailChange(e) {
		this.setState({email: e.target.value});
	};

	passwordChange(e) {
		this.setState({password: e.target.value});
	};

	repeatPasswordChange(e) {
		this.setState({repeatPassword: e.target.value});
	}

	render() {
		var message = null;
		if(this.state.message) {
			message = <div className="alert alert-danger">{this.state.message}</div>;
		}

		return(
			<div>
			<h2 style={{"textAlign" : "center"}}>Sign Up</h2>
				<div className="row">
					<div className="col-sm-6 col-sm-offset-3">
						<div className="panel panel-default">
								<div className="panel-body">
									{message}
								<form>
								<fieldset>
										<div className="form-group">
											<label>Email</label>
										<input className="form-control" name="email" type="text" onChange={this.emailChange.bind(this)} />
									</div>
									<div className="form-group">
										<label>Password</label>
										<input className="form-control" name="password" type="password" onChange={this.passwordChange.bind(this)} />
									</div>
									<div className="form-group">
										<label>Repeat password</label>
										<input className="form-control" name="repeatPassword" type="password" onChange={this.repeatPasswordChange.bind(this)} />
									</div>
									<button className="btn btn-lg btn-success btn-block" onClick={this.signup.bind(this)}>Submit</button>
									<hr />
									<p>Already a customer? <Link to="login">Log in here</Link></p>
								</fieldset>
									</form>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

Signup.contextTypes = {
    router: React.PropTypes.object.isRequired
};

export default Signup;