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
				}.bind(this),
			error: function(xhr, status, err) {
				return err;
			}.bind(this)
		});
	}

	render() {

		var optionsGuest = <ul className="nav navbar-nav navbar-right">
								<li><Link to="workersignup"><span className="glyphicon glyphicon-user"></span> Inscription Travailleur</Link></li>
								<li><Link to="signup"><span className="glyphicon glyphicon-user"></span> Inscription</Link></li>
								<li><Link to="login"><span className="glyphicon glyphicon-log-in"></span> Connexion</Link></li>

								</ul>;

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

		var options = null;
		if(sessionStorage.auth === "true") {
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
    router: React.PropTypes.object.isRequired
};

export default TopNavBar;