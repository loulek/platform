import React from "react"
import Router from "react-router";
import {Link} from "react-router";
import Geosuggest from 'react-geosuggest';

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
				workerNumber: null,
				budget: null
			},
			tempSpecialty: [],
			editContact: false,
			editBio: false,
			editLocation: false
		}
	}

	handleChange(e){
		var that=this
    if(e.target.value){
     that.setState({address: e.target.value})}
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

							<Geosuggest inputClassName="form-control" placeholder="" initialValue={this.state.eventData.address} id="address" onChange={this.handleChange}/>

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
						<Link to={'/search/philadelphia'} > Click to find hostess around you</Link>
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

export default CreateEvent
