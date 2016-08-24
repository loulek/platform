import React from "react"
import Router from "react-router";
import {Link} from "react-router";
import Geosuggest from 'react-geosuggest';
import Kronos from 'react-kronos';
import _ from "underscore";
import InputRange from 'react-input-range';

class CreateEvent extends React.Component {
	constructor(props, context) {
		super(props, context);

		console.log("[startDate in CreateEvent]", this.props.startDate)

		this.state = {
			artData: {
				title: '',
				address: this.props.address || '',
				startDate: new Date(this.props.startDate) || new Date(),
				endDate: new Date(this.props.endDate) || new Date(),
				category: '',
				artist: '',
				pricemin:'',
				pricemax:'',
				widthmin:'',
				widthmax:'',
				heightmin:'',
				heightmax:''
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
			oldusers:[],
			eventId:null,
			showFilters:false,
			art: [],
			artCopy: []
		}
		this.invite = this.invite.bind(this);
	}


	componentDidMount(){
		var user = this.context.getUser();
		console.log("this.props.startDate", this.props.startDate)
		console.log("this.props.endDate", this.props.endDate)
		console.log("Do I have the user?", user);
		console.log("user type:", user.type);
		var newartData = {
			address: this.state.artData.address,
			startDate: new Date(this.props.startDate)|| this.state.artData.startDate,
			endDate: new Date(this.props.endDate)|| this.state.artData.endDate,
			startHour: this.state.artData.startHour,
			endHour: this.state.artData.endHour,
			category: this.state.artData.category,
		};
		this.setState({
			artData: newartData,
			editContact: false
		});
		$.ajax({
			url: '/search',
			dataType: 'json',
			type: 'GET',
			success: function(response){
				if (response.success) {
					console.log("[loaded art]", response.art);
					this.setState({
						art: response.art,
						artCopy: response.art
					})

				}
			}.bind(this),
			error: function(err){
				console.log("error")
			}
		})
	}

invite(userId, e){
	console.log("[sending this data]", {
		profile: userId,
		id: this.state.eventId
	})
	$.ajax({
		url: '/notifications',
		dataType: 'json',
		type: 'POST',
		data: {
			profile: userId,
			id: this.state.eventId
		},
		success: function(notifications){
			console.log("NOTIFICATIONS", notifications)
			this.setState({
				notifications: notifications
			})
		}.bind(this),
		error: function(err) {
			console.log("error", err)
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
		this.setState({filter1: [],
		filter2:[]})
	}

	_searchEvent(e) {
		var that=this;
		e.preventDefault();
		var newartData = {
			address: this.state.artData.address,
			startDate: this.state.artData.startDate,
			endDate: this.state.artData.endDate,
			startHour: this.state.artData.startHour,
			endHour: this.state.artData.endHour,
			category: this.state.artData.category,
		};
		console.log("tststtst", newartData)
		this.setState({
			artData: newartData,
			editContact: false
		});
				
	}


_createNewEventOrUpdate(e){
	e.preventDefault();
	var that=this

}

_filter(item, filters) {
	var keysToExclude = ['_id, "startDate','endDate', 'startHour', 'endHour', "profile", "location", "description", "artImageUrl"];
	var ORkeys = ['_id, "startDate','endDate', 'startHour', 'endHour', "profile", "location", "description"];
	var ANDkeys = ['title', 'category', 'artist', 'pricemin', 'pricemax', 'widthmin','widthmax', 'heightmin', 'heightmax'];
	var keys = Object.keys(filters);
	var isTrue = true;

	// ANDkeys.map(function(key) {
	// 	if (keysToExclude.indexOf(key) !== -1) return;
	// 	var val = filters[key];
	// 	console.log(key, "| item[key]: ", item[key], "vs:", val);
	// 	isTrue = isTrue & (
	// 		item[key] != null
	// 		&& item[key].length !== 0
	// 		&& val != null
	// 		&& val.length !== 0
	// 		&& item[key].toLowerCase().startsWith( val.toLowerCase() ) );
	// }.bind(this))

	// // var keys = Object.keys(item);
	// ORkeys.map(function(key) {
	// 	if (keysToExclude.indexOf(key) !== -1) return;
	// 	var val = filters[key];
	// 	console.log(key, "| item[key]: ", item[key], "vs val:", val);
	// 	isTrue = isTrue || (
	// 		item[key]
	// 		&& val
	// 		&& item[key].toLowerCase().startsWith( val.toLowerCase() ) );
	// }.bind(this))

	keys.map((key) => {
		if (keysToExclude.indexOf(key) !== -1) return;

		var itemField = item[key];
		var searchField = filters[key];

		if (searchField === '') return;

		var res = false;
		if (key === 'pricemin') res = filters.pricemin < item.price;
		else if (key === 'pricemax') res = item.price < filters.pricemax;
		else if (key === 'widthmin') res = filters.widthmin < item.width;
		else if (key === 'widthmax') res = item.width < filters.widthmax;
		else if (key === 'heightmin') res = filters.heightmin < item.height;
		else if (key === 'heightmax') res = item.height < filters.heightmax;
		else if (itemField != null && searchField != null) res = itemField.toLowerCase().includes( searchField.toLowerCase() );
		if (ANDkeys.indexOf(key) !== -1) {
			// console.log(key, "AND | itemField: ", itemField, "vs searchField:", searchField);
			isTrue = isTrue && res;
		} else {
			// console.log(key, "OR | itemField: ", itemField, "vs searchField:", searchField);
			isTrue = isTrue || res;
		}
	})

	// console.log("item", item.title);
	console.log("does item pass filter", isTrue);

	return isTrue;
}

_changeStart(e) {
	var newState = Object.assign({}, this.state);
	newState.artData = Object.assign({}, newState.artData, { startDate: e })
	this.setState(newState)
}
_changeEnd(e) {
	var newState = Object.assign({}, this.state);
	newState.artData = Object.assign({}, newState.artData, { endDate: e })
	this.setState(newState)
}
	suggestSelect(e) {
		var artData = Object.assign({}, this.state.artData, { address: e.label })
		this.setState({artData: artData})
	}
	startHourchange(e) {
		var artData = Object.assign({}, this.state.artData, { startHour: e.target.value })
		this.setState({artData: artData})
	}
	endHourchange(e) {
		var artData = Object.assign({}, this.state.artData, { endHour: e.target.value })
		this.setState({artData: artData})
	}
	titlechange(e) {
		var artData = Object.assign({}, this.state.artData, { title: e.target.value })
		this.setState({
			artData: artData,
			art: this.state.artCopy.filter(function(item) { if (item.title !== null) return this._filter(item, artData) }.bind(this))
		})
	}
	categorychange(e) {
		var artData = Object.assign({}, this.state.artData, {category: e.target.value})
		this.setState({
			artData: artData,
			art: this.state.artCopy.filter(function(item) { if (item.category !== null) return this._filter(item, artData) }.bind(this))
		})
	}
	artistchange(e) {
		var artData = Object.assign({}, this.state.artData, {artist: e.target.value})
		this.setState({
			artData: artData,
			art: this.state.artCopy.filter(function(item) { if (item.artist !== null) return this._filter(item, artData) }.bind(this))
		})
	}
	priceminchange(e) {
		var artData = Object.assign({}, this.state.artData, {pricemin: e.target.value})
		this.setState({
			artData: artData,
			art: this.state.artCopy.filter(function(item) { if (item.pricemin !== null) return this._filter(item, artData) }.bind(this))
		})
	}
	pricemaxchange(e){
		var artData = Object.assign({}, this.state.artData, {pricemax: e.target.value})
		this.setState({
			artData: artData,
			art: this.state.artCopy.filter(function(item) { if (item.pricemax !== null) return this._filter(item, artData) }.bind(this))
		})
	}
	widthminchange(e) {
		var artData = Object.assign({}, this.state.artData, {widthmin: e.target.value})
		this.setState({
			artData: artData,
			art: this.state.artCopy.filter(function(item) { if (item.widthmin !== null) return this._filter(item, artData) }.bind(this))
		})
	}
	widthmaxchange(e) {
		var artData = Object.assign({}, this.state.artData, {widthmax: e.target.value})
		this.setState({
			artData: artData,
			art: this.state.artCopy.filter(function(item) { if (item.widthmax !== null) return this._filter(item, artData) }.bind(this))
		})
	}
	heightminchange(e) {
		var artData = Object.assign({}, this.state.artData, {heightmin: e.target.value})
		this.setState({
			artData: artData,
			art: this.state.artCopy.filter(function(item) { if (item.heightmin !== null) return this._filter(item, artData) }.bind(this))
		})
	}
	heightmaxchange(e) {
		var artData = Object.assign({}, this.state.artData, {heightmax: e.target.value})
		this.setState({
			artData: artData,
			art: this.state.artCopy.filter(function(item) { if (item.heightmax !== null) return this._filter(item, artData) }.bind(this))
		})
	}


	_createEvent(isEnabled) {


		return (
			<div className='panel panel-default panel-search'>
				<div className='panel-heading'>
					<h3 className="panel-title">Fine Art</h3>
				</div>
				<div className='panel-body'>
					<div className="form-group row">
						<div className="col-sm-12 col-md-12">
							<input type="text" placeholder="Artist Name" className="form-control" defaultValue={this.state.artData.artist} onChange={this.artistchange.bind(this)} />
						</div>
					</div>
					<div className="form-group row">
						<div className="col-sm-12 col-md-12">
							<input type="text" placeholder="Art Title" className="form-control" defaultValue={this.state.artData.title} onChange={this.titlechange.bind(this)} />
						</div>
					</div>
					<div className="form-group row">
						<div className="col-sm-12 col-md-12">
							<select className="form-control" name="category" defaultValue={this.state.artData.category} onChange={this.categorychange.bind(this)}>
								<option value="" selected >All Categories</option>
								<option value='Painting'>Painting</option>
								<option value='Photography'>Photography</option>
								<option value='Prints'>Prints</option>
								<option value='Sculptures'>Sculptures</option>
								<option value='Drawings'>Drawings</option>
								<option value='More Art'>More Art</option>
							</select>
						</div>
					</div>
					<div className="numberSearch">
						<div className="form-group row">
							<div className="col-sm-12 col-md-12">
								<input type="text" placeholder="$ Min" className="form-control" defaultValue={this.state.artData.pricemin} onChange={this.priceminchange.bind(this)} />
							</div>
						</div>
						<div className="form-group row">
							<div className="col-sm-12 col-md-12">
								<input type="text" placeholder="$ Max" className="form-control" defaultValue={this.state.artData.pricemax} onChange={this.pricemaxchange.bind(this)} />
							</div>
						</div>
					</div>
					Dimensions:
					<div className="numberSearch">
						<div className="form-group row">
							<div className="col-sm-12 col-md-12">
								<input type="text" placeholder="W in. Min" className="form-control" defaultValue={this.state.artData.widthmin} onChange={this.widthminchange.bind(this)} />
							</div>
						</div>
						<div className="form-group row">
							<div className="col-sm-12 col-md-12">
								<input type="text" placeholder="W in. Max" className="form-control" defaultValue={this.state.artData.widthmax} onChange={this.widthmaxchange.bind(this)} />
							</div>
						</div>
					</div>
					<div className="numberSearch">
						<div className="form-group row">
							<div className="col-sm-12 col-md-12">
								<input type="text" placeholder="H in. Min" className="form-control" defaultValue={this.state.artData.heightmin} onChange={this.heightminchange.bind(this)} />
							</div>
						</div>
						<div className="form-group row">
							<div className="col-sm-12 col-md-12">
								<input type="text" placeholder="H in. Max" className="form-control" defaultValue={this.state.artData.heightmax} onChange={this.heightmaxchange.bind(this)} />
							</div>
						</div>
					</div>				
				</div>
			</div>
			);
		}


handleClick(e){
	var val=e.target.value;
	var that=this
	var filter1=this.state.filter1
	if (filter1.indexOf(val)===-1){
		filter1.push(val)
		// var users=this.state.users;
		// var returnusers=[];
		// users.forEach(function(u){
		// 	var speciality=u.specialty
		// 	for (var i=0;i<filter1.length;i++){
		// 		if (speciality.indexOf(filter1[i])){
		// 			returnusers.push(u)
		// 		}
		// 	}
		// })

		that.setState({
			filter1:filter1
		})
	}else{
		filter1.splice(filter1.indexOf(val),1)
		that.setState({filter1:filter1})
	}
// 	var filter2=this.state.filter2
// if (this.state.filter1.indexOf(val)===-1){
// 				filter1.push(val)
// 				$.ajax({
// 					url: '/findProfile',
// 					dataType: 'json',
// 					type: 'POST',
// 					data: {
// 						criteria2:JSON.stringify(filter2),
// 						criteria1: JSON.stringify(filter1),
// 						address: $('#address').val()},
// 					success: function(users){
// 						console.log("users", users)
// 						var newusers=users
// 						for(var i=0;i<newusers.length;i++){
// 							for (var j=0;j<newusers.length-1;j++){
// 								if (newusers[j]["specialty"].length<newusers[j+1]["specialty"].length){var temp=newusers[j]; newusers[j]=newusers[j+1]; newusers[j+1]=temp}
// 							}
// 						}
// 						console.log("newusers",newusers)
//
//
// 						that.setState({
// 							users:newusers,
// 							filter1:filter1
// 						})
//
// 					},
// 					error: function(err){
// 						console.log("error",err)
// 					}
// 				})
// 			}
// else{
// 	filter1.splice(filter1.indexOf(val),1)
// 	$.ajax({
// 		url: '/findProfile',
// 		dataType: 'json',
// 		type: 'POST',
// 		data: {
// 			criteria2:JSON.stringify(filter2),
// 			criteria1: JSON.stringify(filter1),
// 			address: $('#address').val()},
// 		success: function(users){
// 			console.log("users", users)
// 			var newusers=users
// 			for(var i=0;i<newusers.length;i++){
// 				for (var j=0;j<newusers.length-1;j++){
// 					if (newusers[j]["specialty"].length<newusers[j+1]["specialty"].length){var temp=newusers[j]; newusers[j]=newusers[j+1]; newusers[j+1]=temp}
// 				}
// 			}
//
//
// 			that.setState({
// 				users:newusers,
// 				filter1:filter1
// 			})
//
// 		},
// 		error: function(err){
// 			console.log("error",err)
// 		}
// 	})
// }
}

handleClick2(e){
	var val=e.target.value;
	var that=this
	var filter2=this.state.filter2
if (this.state.filter2.indexOf(val)===-1){
			filter2.push(val)
			that.setState({filter2:filter2})
			// $.ajax({
			// 	url: '/findProfile',
			// 	dataType: 'json',
			// 	type: 'POST',
			// 	data: {
			// 		criteria2:JSON.stringify(filter2),
			// 		criteria1: JSON.stringify(filter1),
			// 		address: $('#address').val()},
			// 	success: function(users){
			// 		console.log("users", users)
			// 		var newusers=users
			// 		for(var i=0;i<newusers.length;i++){
			// 			for (var j=0;j<newusers.length-1;j++){
			// 				if (newusers[j]["job"].length<newusers[j+1]["job"].length){var temp=newusers[j]; newusers[j]=newusers[j+1]; newusers[j+1]=temp}
			// 			}
			// 		}
			//
			// 		that.setState({
			// 			users:newusers,
			// 			filter2:filter2
			// 		})
			//
			// 	},
			// 	error: function(err){
			// 		console.log("error",err)
			// 	}
			// })
}
else{
	filter2.splice(filter2.indexOf(val),1)
	that.setState({filter2:filter2})
// $.ajax({
// 	url: '/findProfile',
// 	dataType: 'json',
// 	type: 'POST',
// 	data: {
// 		criteria2:JSON.stringify(filter2),
// 		criteria1: JSON.stringify(filter1),
// 		address: $('#address').val()},
// 	success: function(users){
// 		console.log("users", users)
// 		var newusers=users
// 		for(var i=0;i<newusers.length;i++){
// 			for (var j=0;j<newusers.length-1;j++){
// 				if (newusers[j]["job"].length<newusers[j+1]["job"].length){var temp=newusers[j]; newusers[j]=newusers[j+1]; newusers[j+1]=temp}
// 			}
// 		}
//
// 		that.setState({
// 			users:newusers,
// 			filter2:filter2
// 		})
//
// 	},
// 	error: function(err){
// 		console.log("error",err)
// 	}
// })
 }
}

handleClick3(e){
	e.preventDefault;
	console.log("starting!")
	this.context.router.push({
		query: {
			address: this.state.artData.address,
			startDate: this.state.artData.startDate.toString(),
			endDate: this.state.artData.endDate.toString()
		}
	});
}

render() {
	var that=this
	var contactForm = null;
	var filter1=this.state.filter1;
	var filter2=this.state.filter2;
	if (filter1.length===0){filter1=["English","Italiano","Français"]}
	if (filter2.length===0){filter2=["Accueil événementiel","Accueil entreprise","Animation commerciale","Serveur","Voiturier","Barman"]}
	if(this.state.editContact) {
		contactForm = this._createEvent(true);
	} else {
		contactForm = this._createEvent(false);
	}
// 		var usersquare=[];
// 		var returnusers=[];
// 		var returnusers2=[];
// 		var returnusers3=[];
// 		var users=this.state.users
// 		var val=this.state.value
// if (this.state.users.length>0){
// 		console.log("USERS INSDIE HANDLE CHANGE", users)
// 		for (var i=0;i<users.length;i++){
// 			if (users[i].salary<=val){returnusers.push(users[i])}
// 		}
// 		console.log("BEFORE some ", returnusers)
// 		for (var k=0;k<returnusers.length;k++){
// 		if (_.intersection(returnusers[k].specialty, filter1).length > 0)
// 		{returnusers2.push(returnusers[k])}
// 	}


// 		for (var p=0;p<returnusers2.length;p++){
// 		if (_.intersection(returnusers2[p].job, filter2).length > 0)
// 		{returnusers3.push(returnusers2[p])}
// 	}
// }

// for(var j=0;j<returnusers.length;j++){
// 		var speciality=returnusers[j].specialty
// 		console.log("SPECIALITY INSIDE RETURNUSERS FOREACH",returnusers[j])
// 		for (var k=0;k<filter1.length;k++){
// 			if (speciality.indexOf(filter1[k])===-1){returnusers.splice(j,1)}
// 		}
// 		for (var l=0;l<filter2.length;l++){
// 			if (speciality.indexOf(filter2[l])===-1){returnusers.splice(j,1)}
// 		}
// }
	// // var returnusers = this.tar;
	// console.log("RETURNUSERS BEFORE FOR EACH", returnusers)
	// var user = this.context.getUser()
	// if(user.type === "Profile" || user.type === "Client"){
	// 	returnusers.forEach(function(u){
	// 	usersquare.push(
	// 				<div>
	// 					<div className="img">
	// 					<Link to={`/profile/${u._id}`} onClick={that.handleClick3}><img src={u.profileImageUrl} alt="Image" /></Link>
	// 					</div>
	// 					<div className="text_image">
	// 						<h2 style={{fontSize: "100%"}}>{u.firstName}&nbsp;&nbsp;{u.salary}€/heure</h2>
	// 						<button className="btn btn-success" onClick={that.invite.bind(this, u._id)}>Send invite link</button>
	// 					</div>
	// 				</div>
	// 				)
	// 		})
	// 	} else {

	// 	returnusers3.forEach(function(u){
	// 	usersquare.push(
	// 				<div>
	// 					<div className="img">
	// 					<Link to={`/signup`} onClick={that.handleClick3}><img src={u.profileImageUrl} alt="Image" /></Link>
	// 					</div>
	// 					<div className="text_image">
	// 						<h2 style={{fontSize: "100%"}}>{u.firstName}&nbsp;&nbsp;{u.salary}€/heure</h2>
	// 						<button className="btn btn-success">Contact</button>
	// 					</div>
	// 				</div>
	// 				)
	// 		})

	// 	}
	var art = this.state.art.map((artObj, i) => {
		return (
			<div key={"art-" + i}> 
			  <Link to={`/art/${artObj._id}`}>
				<div >
					<img src={artObj.artImageUrl} style={{width:"200px"}} />
				</div>	
			  </Link>		
			</div>
		);
	})

		return (
			<div>
				<h3 className='landcenter'>
					Rent a MasterPiece
				</h3>
				  <div className="container-search">
					<div className="search_box .col-md-2">
						{contactForm}
					</div>
					<div className="bg-result .col-md-8 art-display-search">
						{art}
					</div>
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

CreateEvent.contextTypes = {
	router: React.PropTypes.object,
	getUser: React.PropTypes.func,
}


module.exports=CreateEvent
