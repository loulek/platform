import React from "react";
import {Link} from "react-router";

class AccountInfo extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div>
			<h3>Account Information</h3>
			</div>
		);
	}
}

AccountInfo.contextTypes = {
    router: React.PropTypes.object.isRequired
};

export default AccountInfo;