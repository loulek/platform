import React from "react";
import Router from "react-router";
import {Link} from "react-router";

class Login extends React.Component {

	constructor() {
		super();

		this.state = {
			email: null,
			message: null
		};
	}

	change(e) {
		e.preventDefault();
		if(this.state.password !== this.state.repeatPassword) {
			return this.setState({
				message: "Les mots de passe ne sont pas pareil."
			});
		}
		
		console.log("this.props.params.id", this.props.params.id)

		$.ajax({
			url: '/newpass',
			dataType: 'json',
			type: 'POST',
			data: {
				id: this.props.params.id,
				password: this.state.password
			},
			success: function(data) {
			if(data.status === 'ok') {
					this.context.router.push(data.redirect);
				} else if(data.status === 'error') {
					this.setState({
						message: data.error
					});
				} 
			}.bind(this),
			error: function(xhr, status, err) {
				this.setState({
					message: "You remail does not match our database."
				});
			}.bind(this)
		});
	}

	passwordChange(e) {
		this.setState({password: e.target.value});
	};

	repeatPasswordChange(e) {
		this.setState({repeatPassword: e.target.value});
	};

	render() {

		var message = null;
		if(this.state.message) {
			message = <div className="alert alert-danger">{this.state.message}</div>;
		}

		return(
			<div>
			<h2 style={{"textAlign" : "center", "color" : "white", "textShadow": "2px 2px black"}}>Forgot your password?</h2>
				<div className="row">
					<div className="col-sm-6 col-sm-offset-3">
						<div className="panel panel-default">
							<div className="panel-body">
								{message}
								<form>
								<fieldset>
									<div className="form-group">
										<label>New Password</label>
										<input className="form-control" name="password" type="password" value={this.state.password} onChange={this.passwordChange.bind(this)} />
									</div>
									<div className="form-group">
										<label>Repeat New Password</label>
										<input className="form-control" name="repeatPassword" type="password" value={this.state.repeatPassword} onChange={this.repeatPasswordChange.bind(this)} />
									</div>
									<button className="btn btn-lg btn-success btn-block" onClick={this.change.bind(this)}>Change Password</button>
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
    router: React.PropTypes.object.isRequired,
    setUser: Object
};

export default Login;