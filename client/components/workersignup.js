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
				message: 'Email manquant.'
			});
		}

		var x = this.state.email;
	    var atpos = x.indexOf("@");
	    var dotpos = x.lastIndexOf(".");
	    if (atpos<1 || dotpos<atpos+2 || dotpos+2>=x.length) {
	    	return this.setState({
	    		message: 'Email invalide.'
	    	})
	    }

		if(!this.state.password) {
			return this.setState({
				message: 'Il manque un mot de passe.'
			});
		}

		if(!this.state.repeatPassword) {
			return this.setState({
				message: 'Veuillez confirmer le mot de passe.'
			});
		}

		if(this.state.password !== this.state.repeatPassword) {
			return this.setState({
				message: "Les mots de passe ne sont pas pareil."
			});
		}

		$.ajax({
			url: '/signup',
			dataType: 'json',
			type: 'POST',
			data: this.state,
			success: function(data) {
				console.log("DATAAAA LOGGG", data)
				if(data.status === 'ok' ) {
					sessionStorage.auth = true;
					this.context.router.push('/login')
				} else if(data.status === 'error') {
					this.setState({
						message: data.error
					});
				}
			}.bind(this),
			error: function(xhr, status, err) {
				console.log(err)
				this.setState({
					message: "Email already exists!"
				});
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
			<video id="background-video" loop autoPlay >
  			<source src="https://s3-us-west-2.amazonaws.com/joshmagic/registerr.mp4" type="video/mp4" />
  			</video>
  			<h3 className='center'>Museum Sign Up</h3>
				<div className="row">
					<div className="col-sm-6 col-sm-offset-3">
						<div className="panel panel-default">
								<div className="panel-body">
									{message}
								<form>
								<fieldset>
										<div className="form-group">
											<label>Email</label>
										<input className="form-control" name="email" type="email" onChange={this.emailChange.bind(this)} />
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