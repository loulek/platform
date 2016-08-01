import React from "react";

class ChangePassword extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			message: null,
			messageState: '',
		}
	}

	_changePassword(e) {
		e.preventDefault();
		$.ajax({
			url: '/user/change-password',
			type: 'POST',
			data: {
				oldPassword: $('#oldPassword').val(),
				newPassword: $('#newPassword').val(),
				repeatNewPassword: $('#repeatNewPassword').val()
			},
			success: function(response) {
				console.log(response);
				if(response.status === 'ok') {
					this.setState({
						message: 'Password was updated.',
						messageState: 'ok'
					});
				} else if(response.status === 'error') {
					this.setState({
						message: response.error,
						messageState: 'error'
					});
				} else {
					this.setState({
						message: 'Unkown error has occurred.',
						messageState: 'error'
					});
				}
			}.bind(this),
			error: function(response) {
				console.log(response)
			}.bind(this)
		});

	}

	render() {

		var message = null;
		if(this.state.messageState === 'error') {
			message = <div className="alert alert-danger">
				{this.state.message}
			</div>;
			setTimeout(function() {
				this.setState({
					messageState: null
				})
			}.bind(this), 3000);
		} else if(this.state.messageState === 'ok') {
			message = <div className="alert alert-success">
				{this.state.message}
			</div>;
			$('#oldPassword').val('');
			$('#newPassword').val('');
			$('#repeatNewPassword').val('')
			setTimeout(function() {
				this.setState({
					messageState: null
				})
			}.bind(this), 3000);
		} else {
			message = null;
		}


		return (
			<div>
				<div className="panel panel-default">
					<div className="panel-heading">
						<h3 className="panel-title">Change password</h3>
					</div>
					<div className="panel-body">
						{message}
						<div className="form-group row">
							<label htmlFor="oldPassword" className="col-sm-4 form-control-label">Old password:</label>
							<div className="col-sm-8">
								<input type="password" className="form-control" id="oldPassword" name="oldPassword" />
							</div>
						</div>
						<div className="form-group row">
							<label htmlFor="newPassword" className="col-sm-4 form-control-label">New password:</label>
							<div className="col-sm-8">
								<input type="password" className="form-control" id="newPassword" name="newPassword" />
							</div>
						</div>
						<div className="form-group row">
							<label htmlFor="repeatNewPassword" className="col-sm-4 form-control-label">Repeat new password:</label>
							<div className="col-sm-8">
								<input type="password" className="form-control" id="repeatNewPassword" name="repeatNewPassword" />
							</div>
						</div>
						<button className="btn btn-success float-right" onClick={this._changePassword.bind(this)}>Change password</button>
					</div>
				</div>
			</div>
		);
	}
}

export default ChangePassword;