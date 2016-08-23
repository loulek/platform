import React from "react";
import {Link} from "react-router";
import Geosuggest from 'react-geosuggest';
import Kronos from 'react-kronos';



class EventProfile extends React.Component {
	constructor(props) {
		super(props);
		this.state={
			event:{
				startDate: 0,
				endDate: 0,
				hostess: []
			}
		}
	}

_updateEvent(e) {
		e.preventDefault();
		var event = this.state.event;
		event.address = this.state.event.address;
		this.setState({
			event: event,
			editEvent: false
		});
		this._saveChanges(e);
	}

	componentDidMount() {

		console.log("[fetching event info]");

	    $.ajax({
			url: '/event/' + this.props.params.id,
			dataType: 'json',
			type: 'GET',
			success: function(data) {
				console.log("success finding users", data)
				this.setState({
					event: data.event
				})
			}.bind(this),
			error: function(err){
				console.log(err,"hereeeee")
			}
	    });
	}

_saveChanges(e) {
		e.preventDefault();
		$.ajax({
			url: '/user/update-event',
			type: 'POST',
			data: this.state.event,
			success: function(data) {
				console.log(data);
			},
			error: function(data) {
				console.log(data);
			}
		});
	}

becomehost(e) {
		e.preventDefault();
		console.log("this.state.event", this.state.event);
		$.ajax({
			url: '/event/' + this.props.params.id,
			type: 'POST',
			data: this.state.event,
			success: function(data) {
				console.log(data);
				alert("Success on becoming a Host!")
				this.setState({
					event: data.event
				})
			}.bind(this),
			error: function(data) {
				console.log(data);
			}
		});
	}

deletehost(user,e) {
		e.preventDefault();
		console.log("this.state.event", this.state.event);
		$.ajax({
			url: '/deletehost/' + this.props.params.id,
			type: 'POST',
			data: {
				hostess : user._id
			},
			success: function(data) {
				console.log(data);
				alert("Success on deleting a Host!")
				console.log("data", data)
				console.log("data.event", data.event)
				this.setState({
					event: data.event
				})
			}.bind(this),
			error: function(data) {
				console.log(data);
			}
		});
	}	

suggestSelect(e) {
		var event = Object.assign({}, this.state.event, {address: e.label })
		this.setState({event: event})
	}
titlechange(e) {
		var event = Object.assign({}, this.state.event, {title: e.target.value})
		this.setState({event: event})
}	
descriptionchange(e) {
		var event = Object.assign({}, this.state.event, {description: e.target.value})
		this.setState({event: event})
	}
workerNumberchange(e) {
		var event = Object.assign({}, this.state.event, {workerNumber: e.target.value})
		this.setState({event: event})
	}		
startHourchange(e) {
		var event = Object.assign({}, this.state.event, {startHour: e.target.value})
		this.setState({event: event})
}
endHourchange(e) {
		var event = Object.assign({}, this.state.event, {endHour: e.target.value})
		this.setState({event: event})
}
changeStart(e) {
		var newState = Object.assign({}, this.state);
		newState.event = Object.assign({}, newState.event, {startDate: e})
		this.setState(newState)
	}
changeEnd(e) {
		var newState = Object.assign({}, this.state);
		newState.event = Object.assign({}, newState.event, {endDate: e})
		this.setState(newState)
	}	

_editEvent(isEnabled) {
var d = new Date(this.state.event.startDate);
var dt = new Date(this.state.event.endDate);
    if(isEnabled) {
      return (<div className="container events">
		            <div className='panel panel-default'>
		                <div className='panel-heading'>
		                  <h3 className="panel-title">Event Name: {this.state.event.title} </h3>
		                </div>
		                	<h4>Title<input type="text" className="form-control" name="title" value={this.state.event.title} onChange={this.titlechange.bind(this)} /></h4>
		                	<div>
							<h4>Address<Geosuggest inputClassName="form-control" placeholder={this.state.event.address}  value={this.state.event.address} onSuggestSelect={this.suggestSelect.bind(this)} /></h4>
							</div>
							<h4>Description<input type="text" className="form-control" name="description" value={this.state.event.description} onChange={this.descriptionchange.bind(this)}  /></h4>
							<h4>Number of hostesses<select className="form-control" value={this.state.event.workerNumber} name="workerNumber" onChange={this.workerNumberchange.bind(this)}>
																		<option value="" selected disabled>Nombre dHôtes(ses)</option>
																		<option value='1'>1</option>
																		<option value='2'>2</option>
																		<option value='3'>3</option>
																		<option value='4'>4</option>
																		<option value='5'>5</option>
																		<option value='6'>6</option>
																		<option value='7'>7</option>
																		<option value='8'>8</option>
																		<option value='9'>9</option>
																		<option value='10'>10</option>
																</select></h4>
							<h4>Time From<select className="form-control" name="startHour" value={this.state.event.startHour} onChange={this.startHourchange.bind(this)}>
										 <option value="" selected disabled>Heure de début</option>
																		<option value='7:00'>7:00</option>
																		<option value='7:30'>7:30</option>
																		<option value='8:00'>8:00</option>
																		<option value='8:30'>8:30</option>
																		<option value='9:00'>9:00</option>
																		<option value='9:30'>9:30</option>
																		<option value='10:00'>10:00</option>
																		<option value='10:30'>10:30</option>
																		<option value='11:00'>11:00</option>
																		<option value='11:30'>11:30</option>
																		<option value='12:00'>12:00</option>
																		<option value='12:30'>12:30</option>
																		<option value='13:00'>13:00</option>
																		<option value='13:30'>13:30</option>
																		<option value='14:00'>14:00</option>
																		<option value='14:30'>14:30</option>
																		<option value='15:00'>15:00</option>
																		<option value='15:30'>15:30</option>
																		<option value='16:00'>16:00</option>
																		<option value='16:30'>16:30</option>
																		<option value='17:00'>17:00</option>
																		<option value='17:30'>17:30</option>
																		<option value='18:00'>18:00</option>
																		<option value='18:30'>18:30</option>
																		<option value='19:00'>19:00</option>
																		<option value='19:30'>19:30</option>
																		<option value='20:00'>20:00</option>
																		<option value='20:30'>20:30</option>
																		<option value='21:00'>21:00</option>
																		<option value='21:30'>21:30</option>
																		<option value='22:00'>22:00</option>
																		<option value='22:30'>22:30</option>
																		<option value='23:00'>23:00</option>
																		<option value='23:30'>23:30</option>
																</select></h4>
							<h4>Time To<select className="form-control" name="endHour" value={this.state.event.endHour} onChange={this.endHourchange.bind(this)}>
										<option value="" selected disabled>Heure de fin</option>
																		<option value='7:30'>7:30</option>
																		<option value='8:00'>8:00</option>
																		<option value='8:30'>8:30</option>
																		<option value='9:00'>9:00</option>
																		<option value='9:30'>9:30</option>
																		<option value='10:00'>10:00</option>
																		<option value='10:30'>10:30</option>
																		<option value='11:00'>11:00</option>
																		<option value='11:30'>11:30</option>
																		<option value='12:00'>12:00</option>
																		<option value='12:30'>12:30</option>
																		<option value='13:00'>13:00</option>
																		<option value='13:30'>13:30</option>
																		<option value='14:00'>14:00</option>
																		<option value='14:30'>14:30</option>
																		<option value='15:00'>15:00</option>
																		<option value='15:30'>15:30</option>
																		<option value='16:00'>16:00</option>
																		<option value='16:30'>16:30</option>
																		<option value='17:00'>17:00</option>
																		<option value='17:30'>17:30</option>
																		<option value='18:00'>18:00</option>
																		<option value='18:30'>18:30</option>
																		<option value='19:00'>19:00</option>
																		<option value='19:30'>19:30</option>
																		<option value='20:00'>20:00</option>
																		<option value='20:30'>20:30</option>
																		<option value='21:00'>21:00</option>
																		<option value='21:30'>21:30</option>
																		<option value='22:00'>22:00</option>
																		<option value='22:30'>22:30</option>
																		<option value='23:00'>23:00</option>
																		<option value='23:30'>23:30</option>
																		<option value='24:00'>24:00</option>
																</select>
							</h4>

							<h4>Date From<MyDatePicker onChange={this.changeStart.bind(this)} name="d" value={d.toDateString()} datetime={this.state.event.startDate} placeholder={"Date de début"} /></h4>
							<h4>Date To<MyDatePicker onChange={this.changeEnd.bind(this)} name="dt" value={dt.toDateString()} datetime={this.state.event.endDate} placeholder={"Date de fin"} /></h4>
							<button className="btn btn-success margin5 float-right" onClick={this._updateEvent.bind(this)}>Save</button>
							<button className="btn btn-warning margin5 float-right" onClick={function() {this.setState({editEvent: false})}.bind(this)}>Cancel</button>
				    </div>
				</div>)
    } else {
								console.log("this.state.event.", this.state.event)

    	var user = this.context.getUser()
    	if(user.type === "Client"){
	      return (
	        <div className="container events">
			            <div className='panel panel-default'>
			                <div className='panel-heading'>
			                  <h3 className="panel-title">Event Title: {this.state.event.title} </h3>
			                </div>
								<h4>Address: {this.state.event.address}</h4>
								<h4>Description: {this.state.event.description}</h4>
								<h4>Number of Hostesses: {this.state.event.workerNumber}</h4>
								<h4>Time From: {this.state.event.startHour}</h4>
								<h4>Time To: {this.state.event.endHour}</h4>
								<h4>Date From: {d.toDateString()}</h4>
								<h4>Date To: {dt.toDateString()}</h4>
								<h4>Date To: {dt.toDateString()}</h4>
								<h4>Available Hosts: {this.state.event.hostess.map((hostess) => {
									return <div>
												<Link to={`/profile/${hostess._id}`}><img src={hostess.profileImageUrl} style={{width:'110px', margin:'5px'}}/></Link>
												<button className="btn btn-primary" onClick={this.deletehost.bind(this, hostess)}>Delete</button>
											</div>
									}
								)}</h4>
								<button className="btn btn-primary float-right" onClick={function() {this.setState({editEvent: true})}.bind(this)}>Modifier</button>
					    </div>
					</div>
	      );
		}
		if(user.type === "Profile"){
	      return (
	        <div className="container events">
			            <div className='panel panel-default'>
			                <div className='panel-heading'>
			                  <h3 className="panel-title">Event Title: {this.state.event.title} </h3>
			                </div>
								<h4>Address: {this.state.event.address}</h4>
								<h4>Description: {this.state.event.description}</h4>
								<h4>Number of Hostesses: {this.state.event.workerNumber}</h4>
								<h4>Time From: {this.state.event.startHour}</h4>
								<h4>Time To: {this.state.event.endHour}</h4>
								<h4>Date From: {d.toDateString()}</h4>
								<h4>Date To: {dt.toDateString()}</h4>								
								<button className="btn btn-primary float-right" onClick={this.becomehost.bind(this)}>Become Host</button>
					    </div>
					</div>
	      );
		}
    }
  }  

	render() {

	var eventForm = null;
	    if(this.state.editEvent) {
	      eventForm = this._editEvent(true);
	    } else {
	      eventForm = this._editEvent(false);
	    }
		console.log("[state upon render]:", this.state);
		console.log("this.state.event", this.state.event);

		return (
			<div>
			{eventForm}
			</div>
		);
	}
}

class MyDatePicker extends React.Component {
	constructor(props) {
		super(props);

		console.log("[datetime in MyDatePicker]", this.props.datetime)

		this.state = {
			datetime: this.props.datetime
		}
	}

	componentWillReceiveProps(nextProps) {
		this.setState({ datetime: nextProps.datetime })
	}

	render() {
		console.log('[this.state.datetime]',this.state.datetime)
		return(
			<div>
				<Kronos
					date={this.state.datetime}
					onChangeDateTime={this.props.onChange}
					placeholder={this.props.placeholder}
					options={{
						font: "helvetica",
						color: "black",
						moment: {
							lang: 'fr',
							settings: {
							months : 'janvier_février_mars_avril_mai_juin_juillet_août_septembre_octobre_novembre_décembre'.split('_'),
							monthsShort : 'janv._févr._mars_avr._mai_juin_juil._août_sept._oct._nov._déc.'.split('_'),
							monthsParseExact : true,
							weekdays : 'dimanche_lundi_mardi_mercredi_jeudi_vendredi_samedi'.split('_'),
							weekdaysShort : 'dim._lun._mar._mer._jeu._ven._sam.'.split('_'),
							weekdaysMin : 'Lu_Ma_Me_Je_Ve_Sa_Di'.split('_'),
							weekdaysParseExact : true,
							longDateFormat : {
								LT : 'HH:mm',
								LTS : 'HH:mm:ss',
								L : 'DD/MM/YYYY',
								LL : 'D MMMM YYYY',
								LLL : 'D MMMM YYYY HH:mm',
								LLLL : 'dddd D MMMM YYYY HH:mm'
							},
							calendar : {
								sameDay: '[Aujourd\'hui à] LT',
								nextDay: '[Demain à] LT',
								nextWeek: 'dddd [à] LT',
								lastDay: '[Hier à] LT',
								lastWeek: 'dddd [dernier à] LT',
								sameElse: 'L'
							},
							relativeTime : {
								future : 'dans %s',
								past : 'il y a %s',
								s : 'quelques secondes',
								m : 'une minute',
								mm : '%d minutes',
								h : 'une heure',
								hh : '%d heures',
								d : 'un jour',
								dd : '%d jours',
								M : 'un mois',
								MM : '%d mois',
								y : 'un an',
								yy : '%d ans'
							},
							ordinalParse: /\d{1,2}(er|)/,
							ordinal : function (number) {
								return number + (number === 1 ? 'er' : '');
							},
							week : {
								dow : 1, // Monday is the first day of the week.
								doy : 4  // The week this contains Jan 4th is the first week of the year.
							}
						}
						}
					}}
				/>
			</div>

		)
	}
}
EventProfile.contextTypes = {
	router: Object,
	getUser: React.PropTypes.func
}

export default EventProfile;