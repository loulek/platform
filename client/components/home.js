import React from "react"
import Router from "react-router";
import {Link} from "react-router";
import Geosuggest from 'react-geosuggest';


class App extends React.Component {

	constructor(props) {
		super(props);
	}

	render() {

		var guestContent = <div><h3>Viewing page as guest</h3></div>;


		var userContent = <div>
							<h3>Bienvenue</h3>
							<hr />
							<EditEvent />
						  </div>;

		var content = null;
		if(sessionStorage.auth === "true"){
			content = userContent;
		} else {
			content = guestContent;
		}

		return(
			content
		);
	}

}


class EditEvent extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			profileData: {
				email: null,
				gender: null,
				firstName: null,
				lastName: null,
				phone: null,
				specialty: [],
				image: null,
				description: null,
				profileImageUrl: null,
				resumeImageUrl: null,
				address: null
			},
			tempSpecialty: [],
			editContact: false,
			editBio: false,
			editLocation: false
		}
	}


_editContact(isEnabled) {
	var that = this
			return (
				<div className='panel panel-default'>
					<div className='panel-heading'>
						<h3 className="panel-title">Contact information</h3>
					</div>
					<div className='panel-body'>
						<div className="form-group row">
							<p className="col-sm-2 form-control-static"><b>Nom de l'événement:</b></p>
							<div className="col-sm-10">
								<input type="text" className="form-control" name="firstName" defaultValue={this.state.profileData.firstName} id="firstName"/>
							</div>
						</div>
						<div className="form-group row">
							<p className="col-sm-2 form-control-static"><b>Lieu:</b></p>
							<div className="col-sm-10">
								<input type="text" className="form-control" name="lastName" defaultValue={this.state.profileData.lastName} id="lastName"/>
							</div>
						</div>
						<div className="form-group row">
						<p className="col-sm-2 form-control-static"><b>Date:</b></p>
						<div className="col-sm-10">
							<p className="form-control-static">{this.state.profileData.email}</p>
						</div>
						</div>
						<div className="form-group row">
							<p className="col-sm-2 form-control-static"><b>Heures de travail:</b></p>
							<div className="col-sm-10">
								<input type="text" className="form-control" name="phone" defaultValue={this.state.profileData.phone} id="phone"/>
							</div>
						</div>
						<div className="form-group row">
							<p className="col-sm-2 form-control-static"><b>Nombre d'employés:</b></p>
							<div className="col-sm-8">

							<Geosuggest inputClassName="form-control" placeholder="" initialValue={this.state.profileData.address} id="address" />

							</div>
						</div>
						<button className="btn btn-success margin5 float-right" onClick={that._updateContact}>Save</button>
						<button className="btn btn-warning margin5 float-right" onClick={function() {this.setState({editContact: false, tempSpecialty:[]})}.bind(this)}>Cancel</button>
					</div>
				</div>
			);
		} 


render() {

		var contactForm = null;
		if(this.state.editContact) {
			contactForm = this._editContact(true);
		} else {
			contactForm = this._editContact(false);
		}


		return (
			<div>
				<h3 className='center'>Quel est ton événement?</h3>
				<hr />
				{contactForm}
				<hr />
			</div>
		);
	}
}





export default App;