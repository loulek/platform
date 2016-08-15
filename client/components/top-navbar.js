import React from "react";
import {Link} from "react-router";

class TopNavBar extends React.Component{
	constructor(props) {
		super(props);
	}

	_logout() {
		$.ajax({
			url: '/logout',
			type: 'POST',
			success: function(data) {
				sessionStorage.auth = false;
				this.context.router.push('/');
				this.context.setUser({});
			}.bind(this),
			error: function(xhr, status, err) {
				return err;
			}.bind(this)
		});
	}

	render() {

		var optionsGuest = <ul className="nav navbar-nav navbar-right">
								<li><Link to="workersignup"><span className="glyphicon glyphicon-user"></span> Find Jobs</Link></li>
								<li><Link to="signup"><span className="glyphicon glyphicon-user"></span> Find Hosts</Link></li>
								<li><Link to="login"><span className="glyphicon glyphicon-log-in"></span> Login</Link></li>

								</ul>;

		var user = this.context.getUser()
		console.log("USER.TYPE", user.type)
		if(user.type === "Profile"){
		var optionsUser = 	<ul className="nav navbar-nav navbar-right">
								<li className="dropdown">
									<a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">My Account<span className="caret"></span></a>
									<ul className="dropdown-menu">
										<li><Link to="/account"><i className="fa fa-cog"></i> Account Settings</Link></li>
										<li role="separator" className="divider"></li>
										<li><Link to="/notifications"><i className="fa fa-cog"></i> Notifications</Link></li>
										<li role="separator" className="divider"></li>
										<li><Link to="/messages"><i className="fa fa-cog"></i> Messages</Link></li>
										<li role="separator" className="divider"></li>
										<li><a href="javascript:void(0);" onClick={this._logout.bind(this)}><span className="glyphicon glyphicon-log-out"></span> Log Out</a></li>
									</ul>
								</li>
							</ul>;	
		}
		else if(user.type === "Client"){
		var optionsUser = 	<ul className="nav navbar-nav navbar-right">
								<li className="dropdown">
									<a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">My Account<span className="caret"></span></a>
									<ul className="dropdown-menu">
										<li><Link to="/account"><i className="fa fa-cog"></i> Account Settings</Link></li>
										<li role="separator" className="divider"></li>
										<li><Link to="/events"><i className="fa fa-cog"></i> Events</Link></li>
										<li role="separator" className="divider"></li>
										<li><Link to="/messages"><i className="fa fa-cog"></i> Messages</Link></li>
										<li role="separator" className="divider"></li>
										<li><a href="javascript:void(0);" onClick={this._logout.bind(this)}><span className="glyphicon glyphicon-log-out"></span> Log Out</a></li>
									</ul>
								</li>
							</ul>;	
		} else if (user.type !== "Client" || user.type !== "Profile"){
		var optionsUser = 	<ul className="nav navbar-nav navbar-right">
								<li className="dropdown">
									<a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">My Account<span className="caret"></span></a>
									<ul className="dropdown-menu">
										<li><Link to="/account"><i className="fa fa-cog"></i> Account Settings</Link></li>
										<li role="separator" className="divider"></li>
										<li><a href="javascript:void(0);" onClick={this._logout.bind(this)}><span className="glyphicon glyphicon-log-out"></span> Log Out</a></li>
									</ul>
								</li>
							</ul>;		

		}

		var options = null;
		if(sessionStorage.auth === true || Object.keys(user).length > 0) {
			options = optionsUser;
		} else {
			options = optionsGuest;
		}

		return (
		<nav className="navbar navbar-default navbar-fixed-top">
			<div className="container-fluid">
					<div className="navbar-header">
						<button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#collapsibleTopNavbar">
							<span className="sr-only">Toggle navigation</span>
							<span className="icon-bar"></span>
							<span className="icon-bar"></span>
							<span className="icon-bar"></span>
						</button>
						<Link to="/" className="navbar-brand">
							Platform
						</Link>
					</div>
					<div className="collapse navbar-collapse" id="collapsibleTopNavbar">
						{options}
					</div>
			</div>
		</nav>
		);
	}
}

TopNavBar.contextTypes = {
    router: React.PropTypes.object.isRequired,
    getUser: Object,
    setUser: Object,
};



export default TopNavBar;