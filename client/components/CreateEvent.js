import React from "react"
import Router from "react-router";
import {Link} from "react-router";
import Geosuggest from 'react-geosuggest';
import Kronos from 'react-kronos';

class CreateEvent extends React.Component {
	constructor(props, context) {
		super(props, context);

		console.log("[startDate in CreateEvent]", this.props.startDate)

		this.state = {
			eventData: {
				title: null,
				location: [],
				address: this.props.address || null,
				startDate: new Date(this.props.startDate) ||null,
				endDate: new Date(this.props.endDate) ||null,
				startHour: null,
				endHour: null,
				workerNumber: null,
				budget: null
			},
			tempSpecialty: [],
			editContact: false,
			editBio: false,
			editLocation: false,
			dtLabel: "",
			locale: "",
			users: [],
			value:100,
			filter1:[],
			filter2:[],
			oldusers:[]
		}
	}

componentDidMount(){
	var neweventData = {
		address: $('#address').val(),
		startDate: new Date(this.props.startDate)||$('#startDate').val(),
		endDate: new Date(this.props.endDate)||$('#endDate').val(),
		startHour: $('#startHour').val(),
		endHour: $('#endHour').val(),
		workerNumber: $('#workerNumber').val()
	};
	this.setState({
		eventData: neweventData,
		editContact: false
	});
	$.ajax({
		url: '/search',
		dataType: 'json',
		type: 'POST',
		data: {address: $('#address').val()},
		success: function(users){
			this.setState({
				users:users,
				oldusers:users
			})
			console.log("users", users)
		}.bind(this),
		error: function(err){
			console.log("error")
		}
	})
}


handleChange(e) {
		 this.setState({
			 value: e.target.value
		 });
	 }

reset(e){
	e.preventDefault(e)
	$('input:checkbox').removeAttr('checked');
	var users=this.state.oldusers
	this.setState({users:users})
}

	_searchEvent(e) {
			e.preventDefault();
			console.log("tststtst", this.state)
			// if (typeO$('#workerNumber').val())
			var neweventData = {
				address: $('#address').val(),
				startDate: this.state.eventData.startDate,
        endDate: this.state.eventData.endDate,
				startHour: $('#startHour').val(),
				endHour: $('#endHour').val(),
				workerNumber: $('#workerNumber').val()
			};
			this.setState({
				eventData: neweventData,
				editContact: false
			});
			$.ajax({
	      url: '/search',
	      dataType: 'json',
	      type: 'POST',
	      data: {address: $('#address').val()},
	      success: function(users){

					this.setState({
	          users:users,
						filter1:[],
						filter2:[]
	        })
	        console.log("users", users)
	      }.bind(this),
	      error: function(err){
	        console.log("error")
	        if (err.error){alert("invalid address")}
	      }
	    })
			// $.ajax({
			//       type: "POST",
			//       // specify the url we want to upload our file to
			//       url: '/event/new',
			//       // this is how we pass in the actual file data from the form
			//       data: {
			// 	address: $('#address').val(),
			// 	startDate: this.state.eventData.startDate._d,
			// 	endDate: this.state.eventData.endDate._d,
			// 	startHour: $('#startHour').val(),
			// 	endHour: $('#endHour').val(),
			// 	workerNumber: $('#workerNumber').val(),
			// },
			//   	  success: function(response){
			//   	  console.log("response", response.event);
			//   	  var id=response.event
			//   	  this.context.router.push({
			// 		  pathname: '/search/'+id,
			// 		  query: { modal: true },
			// 		  state: { fromDashboard: true }
			// 		})
			//   	  },
			//   	  error: function(error){
			//   	  console.log("error", error);
			//   	  if(!error.responseJSON.success){
			//   	  		return alert(error.responseJSON.error)
			//   	  	}
			//   	  }
			//     })


		}


	_changeStart(e) {
		var newState = Object.assign({}, this.state);
		newState.eventData = Object.assign({}, newState.eventData, { startDate: e })
		this.setState(newState)
	}

	_changeEnd(e) {
		var newState = Object.assign({}, this.state);
		newState.eventData = Object.assign({}, newState.eventData, { endDate: e })
		this.setState(newState)
	}


	_createEvent(isEnabled) {
		return (
								<div className='panel panel-default'>
										<div className='panel-heading'>
												<h3 className="panel-title">Créez votre événement</h3>
										</div>
										<div className='panel-body'>
												<div className="form-group row">
														<div className="col-sm-4">
																<input type="text" placeholder="Nom d'événement" className="form-control" name="firstName" defaultValue={this.state.eventData.title} id="title"/>
														</div>
														<div className="col-sm-6">
														<Geosuggest inputClassName="form-control" placeholder="Adresse" initialValue={this.state.eventData.address} id="address" />
														</div>
												</div>
												<div className="form-group row">
														<div className="col-sm-4">
																<select className="form-control" defaultValue={this.state.eventData.workerNumber} id="workerNumber">
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
																		<option value='10+'>10+</option>
																</select>
														</div>
														<div className="col-sm-3">
																<select className="form-control" defaultValue={this.state.eventData.workerNumber} id="startHour">
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
																</select>
														</div>
														<div className="col-sm-3">
																<select className="form-control" defaultValue={this.state.eventData.workerNumber} id="endHour">
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
														</div>
												</div>
												<div className="form-group row">
																<div className="col-sm-1">
																		<MyDatePicker onChange={this._changeStart.bind(this)} datetime={this.state.eventData.startDate} placeholder={"Date de début"} />
																</div>
																<div className="col-sm-1 col-sm-offset-3">
																		<MyDatePicker onChange={this._changeEnd.bind(this)} datetime={this.state.eventData.endDate} placeholder={"Date de fin"} />
																</div>
												</div>
												<div className="form-group row">
														<div className="col-sm-10">
																<input type="text" placeholder="Détails du poste (ex: hôtes(ses) d’accueil, street marketeurs, animateurs, serveurs, barmans, voituriers...)" className="form-control" name="firstName" defaultValue={this.state.eventData.title} id="title"/>
														</div>
												</div>


									<div className='panel-heading'>
													<div className="panel-title">
													<label className="checkbox-inline">
														<input type="checkbox" id="inlineCheckbox1" value="Accueil événementiel" onClick={this.handleClick2.bind(this)}> Accueil événementiel </input>
													</label>
													<label className="checkbox-inline">
														<input type="checkbox" id="inlineCheckbox2" value="Accueil entreprise" onClick={this.handleClick2.bind(this)}> Accueil entreprise </input>
													</label>
													<label className="checkbox-inline">
														<input type="checkbox" id="inlineCheckbox3" value="Animation commerciale" onClick={this.handleClick2.bind(this)}> Animation commerciale </input>
													</label>
													<label className="checkbox-inline">
														<input type="checkbox" id="inlineCheckbox1" value="Serveur" onClick={this.handleClick2.bind(this)}> Serveur </input>
													</label>
													<label className="checkbox-inline">
														<input type="checkbox" id="inlineCheckbox2" value="Voiturier" onClick={this.handleClick2.bind(this)}> Voiturier </input>
													</label>
													<label className="checkbox-inline">
														<input type="checkbox" id="inlineCheckbox3" value="Barman" onClick={this.handleClick2.bind(this)}> Barman </input>
													</label>
													</div>
													<div className="panel-title">
													<label className="checkbox-inline">
														<input type="checkbox" id="inlineCheckbox1" value="English" onClick={this.handleClick.bind(this)}> English </input>
													</label>
													<label className="checkbox-inline">
														<input type="checkbox" id="inlineCheckbox2" value="Italiano"onClick={this.handleClick.bind(this)}> Italiano </input>
													</label>
													<label className="checkbox-inline">
														<input type="checkbox" id="inlineCheckbox3" value="Français" onClick={this.handleClick.bind(this)}> Français </input>
													</label>
													</div>
													<button className="btn btn-success margin5 float-right" onClick={this.reset.bind(this)}>reset filters</button>
												<input type="range" value={this.state.value} onChange={this.handleChange.bind(this)} ></input>
												{this.state.value}
												</div>
												<button className="btn btn-success margin5 float-right" onClick={this._searchEvent.bind(this)} address={this.state.address}>Rechercher des Hôtesses</button>


										</div>
								</div>
						);
			}

handleClick(e){
		var val=e.target.value;
		var that=this
		var filter1=this.state.filter1
		var filter2=this.state.filter2
if (this.state.filter1.indexOf(val)===-1){
				filter1.push(val)
				$.ajax({
					url: '/findProfile',
					dataType: 'json',
					type: 'POST',
					data: {
						criteria2:JSON.stringify(filter2),
						criteria1: JSON.stringify(filter1),
						address: $('#address').val()},
					success: function(users){
						console.log("users", users)
						var newusers=users
						for(var i=0;i<newusers.length;i++){
							for (var j=0;j<newusers.length-1;j++){
								if (newusers[j]["specialty"].length<newusers[j+1]["specialty"].length){var temp=newusers[j]; newusers[j]=newusers[j+1]; newusers[j+1]=temp}
							}
						}
						console.log("newusers",newusers)


						that.setState({
							users:newusers,
							filter1:filter1
						})

					},
					error: function(err){
						console.log("error",err)
					}
				})
			}
else{
	filter1.splice(filter1.indexOf(val),1)
	$.ajax({
		url: '/findProfile',
		dataType: 'json',
		type: 'POST',
		data: {
			criteria2:JSON.stringify(filter2),
			criteria1: JSON.stringify(filter1),
			address: $('#address').val()},
		success: function(users){
			console.log("users", users)
			var newusers=users
			for(var i=0;i<newusers.length;i++){
				for (var j=0;j<newusers.length-1;j++){
					if (newusers[j]["specialty"].length<newusers[j+1]["specialty"].length){var temp=newusers[j]; newusers[j]=newusers[j+1]; newusers[j+1]=temp}
				}
			}


			that.setState({
				users:newusers,
				filter1:filter1
			})

		},
		error: function(err){
			console.log("error",err)
		}
	})
}
}

handleClick2(e){
	var val=e.target.value;
	var that=this
	var filter1=this.state.filter1
	var filter2=this.state.filter2
if (this.state.filter2.indexOf(val)===-1){
			filter2.push(val)
			$.ajax({
				url: '/findProfile',
				dataType: 'json',
				type: 'POST',
				data: {
					criteria2:JSON.stringify(filter2),
					criteria1: JSON.stringify(filter1),
					address: $('#address').val()},
				success: function(users){
					console.log("users", users)
					var newusers=users
					for(var i=0;i<newusers.length;i++){
						for (var j=0;j<newusers.length-1;j++){
							if (newusers[j]["job"].length<newusers[j+1]["job"].length){var temp=newusers[j]; newusers[j]=newusers[j+1]; newusers[j+1]=temp}
						}
					}

					that.setState({
						users:newusers,
						filter2:filter2
					})

				},
				error: function(err){
					console.log("error",err)
				}
			})
		}
else{
filter2.splice(filter2.indexOf(val),1)
$.ajax({
	url: '/findProfile',
	dataType: 'json',
	type: 'POST',
	data: {
		criteria2:JSON.stringify(filter2),
		criteria1: JSON.stringify(filter1),
		address: $('#address').val()},
	success: function(users){
		console.log("users", users)
		var newusers=users
		for(var i=0;i<newusers.length;i++){
			for (var j=0;j<newusers.length-1;j++){
				if (newusers[j]["job"].length<newusers[j+1]["job"].length){var temp=newusers[j]; newusers[j]=newusers[j+1]; newusers[j+1]=temp}
			}
		}

		that.setState({
			users:newusers,
			filter2:filter2
		})

	},
	error: function(err){
		console.log("error",err)
	}
})
}
}

handleClick3(e){
	e.preventDefault;
	console.log("starting!")
	this.context.router.push({
		query: {
			address: this.state.eventData.address,
			startDate: this.state.eventData.startDate.toString(),
			endDate: this.state.eventData.endDate.toString()
		},
	});
}

render() {
	var that=this
	var contactForm = null;
		if(this.state.editContact) {
			contactForm = this._createEvent(true);
		} else {
			contactForm = this._createEvent(false);
		}
		var usersquare=[];
		var filters=[]
		filters.push(
			<div className='panel-heading'>
							<div className="panel-title">
							<label className="checkbox-inline">
								Accueil événementiel
								<input type="checkbox" id="inlineCheckbox1" value="Accueil événementiel" onClick={this.handleClick2.bind(this)} />
							</label>
							<label className="checkbox-inline">
								Accueil entreprise
								<input type="checkbox" id="inlineCheckbox2" value="Accueil entreprise" onClick={this.handleClick2.bind(this)} />
							</label>
							<label className="checkbox-inline">
								Animation commerciale
								<input type="checkbox" id="inlineCheckbox3" value="Animation commerciale" onClick={this.handleClick2.bind(this)} />
							</label>
							<label className="checkbox-inline">
								Serveur
								<input type="checkbox" id="inlineCheckbox1" value="Serveur" onClick={this.handleClick2.bind(this)} />
							</label>
							<label className="checkbox-inline">
								Voiturier
								<input type="checkbox" id="inlineCheckbox2" value="Voiturier" onClick={this.handleClick2.bind(this)} />
							</label>
							<label className="checkbox-inline">
								Barman
								<input type="checkbox" id="inlineCheckbox3" value="Barman" onClick={this.handleClick2.bind(this)} />
							</label>
							</div>
							<div className="panel-title">
							<label className="checkbox-inline">
								English
								<input type="checkbox" id="inlineCheckbox1" value="English" onClick={this.handleClick.bind(this)} />
							</label>
							<label className="checkbox-inline">
								Italiano
								<input type="checkbox" id="inlineCheckbox2" value="Italiano"onClick={this.handleClick.bind(this)} />
							</label>
							<label className="checkbox-inline">
								Français
								<input type="checkbox" id="inlineCheckbox3" value="Français" onClick={this.handleClick.bind(this)} />
							</label>
							</div>
							<button className="btn btn-success margin5 float-right" onClick={this.reset.bind(this)}>reset filters</button>
						<input type="range" value={this.state.value} onChange={this.handleChange.bind(this)} ></input>
						{this.state.value}
						</div>
		)

if (this.state.users.length>0){
		var users=this.state.users
		var val=this.state.value
		var returnusers=[];
		console.log("USERS INSDIE HANDLE CHANGE", users)
		for (var i=0;i<users.length;i++){
			if (users[i].salary<=val){returnusers.push(users[i])}
		}
		returnusers.forEach(function(u){
		usersquare.push(
					<div>
						<div className="img">
						<Link to={`/profile/${u._id}`} onClick={that.handleClick3}><img src={u.profileImageUrl} alt="Image" /></Link>
						</div>
						<div className="text_image">
							<h2 style={{fontSize: "100%"}}>{u.firstName}&nbsp;&nbsp;{u.salary}€/heure</h2>
							<button className="btn btn-success">Contact</button>
						</div>
					</div>
					)
			})
		}

		return (
				<div className="container">
					<h3 className='center'>Travaillez avec les meilleures Hôtesses</h3>
					{contactForm}
						<div className="row col-sm-1 bg-result">
							{usersquare}
						</div>
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
					        // months : 'janvier_février_mars_avril_mai_juin_juillet_août_septembre_octobre_novembre_décembre'.split('_'),
					        // monthsShort : 'janv._févr._mars_avr._mai_juin_juil._août_sept._oct._nov._déc.'.split('_'),
					        // monthsParseExact : true,
					        // weekdays : 'dimanche_lundi_mardi_mercredi_jeudi_vendredi_samedi'.split('_'),
					        // weekdaysShort : 'dim._lun._mar._mer._jeu._ven._sam.'.split('_'),
					        // weekdaysMin : 'Lu_Ma_Me_Je_Ve_Sa_Di'.split('_'),
					        // weekdaysParseExact : true,
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

CreateEvent.contextTypes = {
	router: Object
}


module.exports=CreateEvent
