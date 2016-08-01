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
							<CreateEvent />
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


class CreateEvent extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			eventData: {
				title: null,
				location: [],
				address: null,
				startDate: null,
				endDate: null,
				startHour: null,
				endHour: null,
<<<<<<< HEAD
				workerNumber: null,
				budget: null	
=======
				workers: null,
				budget: null
>>>>>>> z
			},
			tempSpecialty: [],
			editContact: false,
			editBio: false,
			editLocation: false
		}
	}

_createEvent(isEnabled) {
	var that = this
			return (
				<div className='panel panel-default'>
					<div className='panel-heading'>
						<h3 className="panel-title">Contact information</h3>
					</div>
					<div className='panel-body'>
						<div className="form-group row">
							<p className="col-sm-2 form-control-static"><b>Nom d'Événement:</b></p>
							<div className="col-sm-8">
								<input type="text" className="form-control" name="firstName" defaultValue={this.state.eventData.title} id="title"/>
							</div>
						</div>
						<div className="form-group row">
							<p className="col-sm-2 form-control-static"><b>Adresse:</b></p>
							<div className="col-sm-8">

							<Geosuggest inputClassName="form-control" placeholder="" initialValue={this.state.eventData.address} id="address" />

							</div>
						</div>
						<div className="form-group row">
							<p className="col-sm-2 form-control-static"><b>Nombre d'Hôtes(ses):</b></p>
							<div className="col-sm-8">
								<select className="form-control" defaultValue={this.state.eventData.workerNumber} id="workerNumber">
									<option value='1'>1</option>
									<option value='2'>2</option>
									<option value='3'>3</option>
									<option value='4'>4</option>
									<option value='5'>5</option>
									<option value='6'>6</option>
									<option value='7'>7</option>
									<option value='8'>8</option>
									<option value='9'>9</option>
									<option value='10+'>10+</option>
								</select>
							</div>
						</div>
						<div className="form-group row">
						<p className="col-sm-2 form-control-static"><b>Date:</b></p>
						<div className="col-sm-10">
							<p className="form-control-static">{this.state.eventData.email}</p>
						</div>
						</div>
						<div className="form-group row">
							<p className="col-sm-2 form-control-static"><b>Heures de travail:</b></p>
							<div className="col-sm-10">
								<input type="text" className="form-control" name="phone" defaultValue={this.state.eventData.phone} id="phone"/>
							</div>
						</div>
						<button className="btn btn-success margin5 float-right" onClick={that._updateContact}>Save</button>
						<button className="btn btn-warning margin5 float-right" onClick={function() {this.setState({CreateEvent: false, tempSpecialty:[]})}.bind(this)}>Cancel</button>
					</div>
				</div>
			);
		}


render() {

		var contactForm = null;
		if(this.state.editContact) {
			contactForm = this._createEvent(true);
		} else {
			contactForm = this._createEvent(false);
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
