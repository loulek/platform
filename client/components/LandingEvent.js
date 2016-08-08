import React from "react"
import Router from "react-router";
import {Link} from "react-router";
import Geosuggest from 'react-geosuggest';
import Kronos from 'react-kronos';

class LandingEvent extends React.Component {
	constructor(props, context) {
		super(props, context);

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
			editLocation: false,
			dtLabel: "",
			locale: "",
			users: [],
			value:10
		}
	}

	handleChange(e) {
		 this.setState({
			 value: e.target.value
		 });
	 }


	_searchEvent(e) {
		e.preventDefault();

		console.log("INFO THAT GETS PASSED IN", this.state);
		console.log("INFO THAT GETS PASSED IN", this.state.eventData.address)
		console.log("THIS>STATE>EVENTDATA", this.state.eventData);
		console.log("THIS>STATE>EVENTDATA>STARTDATE", this.state.eventData.startDate);
		this.context.router.push({

			pathname: '/search',
			query: {
				address: this.state.eventData.address,
				startDate: this.state.eventData.startDate.toString(),
				endDate: this.state.eventData.endDate.toString()
			},
		});

	}

	_changeStart(e) {
		console.log("EEEEEEEEEEEEE", e)
		var eventData = Object.assign({}, this.state.eventData, { startDate: e , endDate: e})
		this.setState({ eventData: eventData })
	}

	_changeEnd(e) {
		var eventData = Object.assign({}, this.state.eventData, { endDate: e })
		this.setState({ eventData: eventData })
	}
	// _changeAddress(e) {
	// 	var eventData = {};
	// 	eventData = Object.assign({}, this.state.eventData, { address: e })
	// 	console.log("New address:", e);
	// 	this.setState({ eventData: eventData})
	// }

	suggestSelect(e) {
		var eventData = Object.assign({}, this.state.eventData, { address: e.label })
		this.setState({eventData: eventData})
	}


	_createEvent(isEnabled) {
		return (
			<div className='panel panel-default'>
				<div className='panel-heading'>
					<h3 className="panel-title">Créez votre événement</h3>
				</div>
				<div className='panel-body'>
					<div className="form-group row">

						{ /*  This is the location autocompleter */ }
						<div className="col-sm-6">
							<Geosuggest inputClassName="form-control" placeholder="Adresse" initialValue={this.state.eventData.address} onSuggestSelect={this.suggestSelect.bind(this)} id="address" />
						</div>

					</div>

					<div className="form-group row">

						{ /*  This is the start date datepicket */ }
						<div className="col-sm-1">
							<MyDatePicker onChange={this._changeStart.bind(this)} datetime={this.state.eventData.startDate} placeholder={"Date de début"} />
						</div>

						{ /*  This is the end date datepicket */ }
						<div className="col-sm-1 col-sm-offset-3">
							<MyDatePicker onChange={this._changeEnd.bind(this)} datetime={this.state.eventData.endDate} placeholder={"Date de fin"} />
						</div>

					</div>


					<button className="btn btn-success margin5 float-right" onClick={this._searchEvent.bind(this)} >Rechercher des Hôtesses</button>
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
		var usersquare=[];
		var filters=[]
		if (this.state.users.length>0){
			filters.push(
				<div className='panel-heading'>
		            <div className="panel-title">
		            <label className="checkbox-inline">
		              <input type="checkbox" id="inlineCheckbox1" value="option1"> Accueil événementiel </input>
		            </label>
		            <label className="checkbox-inline">
		              <input type="checkbox" id="inlineCheckbox2" value="option2"> Accueil entreprise </input>
		            </label>
		            <label className="checkbox-inline">
		              <input type="checkbox" id="inlineCheckbox3" value="option3"> Animation commerciale </input>
		            </label>
		            <label className="checkbox-inline">
		              <input type="checkbox" id="inlineCheckbox1" value="option1"> Serveur </input>
		            </label>
		            <label className="checkbox-inline">
		              <input type="checkbox" id="inlineCheckbox2" value="option2"> Voiturier </input>
		            </label>
		            <label className="checkbox-inline">
		              <input type="checkbox" id="inlineCheckbox3" value="option3"> Barman </input>
		            </label>
		            </div>
		            <div className="panel-title">
		            <label className="checkbox-inline">
		              <input type="checkbox" id="inlineCheckbox1" value="English"> English </input>
		            </label>
		            <label className="checkbox-inline">
		              <input type="checkbox" id="inlineCheckbox2" value="Italiano"> Italiano </input>
		            </label>
		            <label className="checkbox-inline">
		              <input type="checkbox" id="inlineCheckbox3" value="Français"> Français </input>
		            </label>
		            </div>
		          <input type="range" value={this.state.value} onChange={this.handleChange.bind(this)} />
	            </div>
			)
			this.state.users.forEach(function(u){
				usersquare.push(

					<div>
						<div className="img">
						<Link to={`/profile/${u._id}`}><img src={u.profileImageUrl} alt="Image" /></Link>
						</div>
						<div className="text_image">
							<h2 style={{fontSize: "100%"}}>{u.firstName}&nbsp;&nbsp;{u.salary}€/heure</h2>
							<button className="btn btn-success">Contact</button>
						</div>
					  </div>


					)
			})
		}

		console.log("CONTACTFORM", contactForm);
		console.log("FILTERS", filters);
		console.log("USERSQUARE", usersquare);
		return (
			<div>
				<h3 className='center'>Travaillez avec les meilleures Hôtesses</h3>
				{contactForm}
				{filters}
				<div className="row col-sm-offset-1">
					{usersquare}
				</div>
			</div>
		);
	}
}



class MyDatePicker extends React.Component {
	constructor(props) {
		super(props);

		this.state = {}
	}

	componentWillReceiveProps(nextProps) {
	    this.setState({ datetime: nextProps.datetime })
	}

	render() {
		console.log('{this.state.datetime}',this.state.datetime)
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

LandingEvent.contextTypes = {
	router: Object
}

module.exports=LandingEvent
