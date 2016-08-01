import React from "react";
import {Link} from "react-router";

class Account extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div>
				<h3>Account Settings</h3>
				<hr />
				<div className="row">
					<div className="col-sm-3">
						<div className="panel panel-default">
							<div className="panel-body">
								<ul className="nav nav-pills nav-stacked">
									<li><Link to="/account/"><i className="fa fa-info-circle" aria-hidden="true"></i> Account Information</Link></li>
									<li><Link to="/account/edit-profile"><i className="fa fa-user" aria-hidden="true"></i> Edit Profile</Link></li>
									<li><Link to="/account/edit-notifications"><i className="fa fa-bell-o" aria-hidden="true"></i> Edit Notifications</Link></li>
									<li><Link to="/account/change-password"><i className="fa fa-key" aria-hidden="true"></i> Change Password</Link></li>
								</ul>
							</div>
						</div>
					</div>
					<div className="col-sm-9">
						{React.Children.map(this.props.children, function(child) {
						return React.cloneElement(child);
					}.bind(this))}
					</div>
				</div>
			</div>
		);
	}
}

Account.contextTypes = {
    router: React.PropTypes.object.isRequired
};

export default Account;