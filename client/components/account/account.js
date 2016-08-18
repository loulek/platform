import React from "react";
import {Link} from "react-router";

class Account extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
			var user = this.context.getUser();
			if (user.type === "Profile"){
				return (
					<div>
						<h3 className='landcenter'>
							My Account
						</h3>
						<hr />
						<div className="row">
							<div className="col-sm-3">
								<div className="panel panel-default">
									<div className="panel-body">
										<ul className="nav nav-pills nav-stacked">
											<li><Link to="/account/"><i className="glyphicon glyphicon-picture" aria-hidden="true"></i> My Gallery</Link></li>
											<li><Link to="/account/edit-profile"><i className="fa fa-user" aria-hidden="true"></i> Edit Profile</Link></li>
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
			} else if(user.type === "Client"){
				return (	
					<div>
						<h3 className='landcenter'>
							My Account
						</h3>
						<hr />
						<div className="row">
							<div className="col-sm-3">
								<div className="panel panel-default">
									<div className="panel-body">
										<ul className="nav nav-pills nav-stacked">
											<li><Link to="/account/edit-profile"><i className="fa fa-user" aria-hidden="true"></i> Edit Profile</Link></li>
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
}

Account.contextTypes = {
    router: React.PropTypes.object.isRequired,
	getUser: React.PropTypes.object.func
}

export default Account;