import React from "react";
import Router from "react-router";
import {Link} from "react-router";

class Login extends React.Component {

	constructor() {
		super();

		this.state = {
			email: null,
			password: null,
			message: null
		};
	}

	login(e) {
		e.preventDefault();

		$.ajax({
			url: '/login',
			dataType: 'json',
			type: 'POST',
			data: this.state,
			success: function(data) {
			if(data.status === 'ok') {
				sessionStorage.auth = true;
				this.context.router.push('/events');
			} else if(data.status === 'error') {
				this.setState({
					message: data.error
				});
			}
			}.bind(this),
			error: function(xhr, status, err) {
			}.bind(this)
		});
	}

	emailChange(e) {
		this.setState({email: e.target.value});
	};

	passwordChange(e) {
		this.setState({password: e.target.value});
	};

	render() {

		var message = null;
		if(this.state.message) {
			message = <div className="alert alert-danger">{this.state.message}</div>;
		}

		return(
			<div>
			<h2 style={{"text-align" : "center", "color" : "white", "text-shadow": "2px 2px black"}}>Connexion</h2>
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
									<p><a>forgot your password?</a></p>
									<button className="btn btn-lg btn-success btn-block" onClick={this.login.bind(this)}>Log In</button>
									<hr />
									<p>New customer? <Link to="signup">Sign up here</Link></p>
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

Login.contextTypes = {
    router: React.PropTypes.object.isRequired
};

export default Login;
