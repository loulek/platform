import React from "react";
import Geosuggest from 'react-geosuggest';
var Lightbox = require('react-image-lightbox');


class EditProfile extends React.Component {
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

	componentWillMount() {
		$.ajax({
			url: '/user/profile',
			type: 'POST',
			success: function(user) {

				// function variables that hold values for setting react state
				var email = null;
				var gender = null;
				var firstName = null;
				var lastName = null;
				var phone = null;
				var specialty = [];
				var image = null;
				var description = null;
				var profileImageUrl = null;
				var resumeImageUrl = null;
				var address = null;

				// populate function variables
				email = user.email;

				if(user.profile) {
					firstName = user.profile.firstName;
					lastName = user.profile.lastName;
					phone = user.profile.phone;
					image = user.profile.image;
					description = user.profile.description;
					profileImageUrl = user.profile.profileImageUrl;
					resumeImageUrl = user.profile.resumeImageUrl;
					address = user.profile.address;


					if(user.profile.gender) {
						gender = user.profile.gender;
					}

					if(user.profile.specialty) {
						specialty = user.profile.specialty;
					} else {
						specialty = [];
					}

				}

				// set react state using values from function variables
				this.setState({
					profileData: {
						email: email,
						gender: gender,
						firstName: firstName,
						lastName: lastName,
						phone: phone,
						specialty: specialty,
						image: image,
						description: description,
						profileImageUrl: profileImageUrl,
						resumeImageUrl : resumeImageUrl,
						address : address
					}
				});
			}.bind(this),
			error: function(err) {
				console.log(err)
			}.bind(this)
		});
	}

	_updateContact(e) {
		e.preventDefault();
		var profileData = this.state.profileData;
		profileData.phone = $('#phone').val();
		profileData.firstName = $('#firstName').val();
		profileData.lastName = $('#lastName').val();
		profileData.gender = $('#genderSelector').val();
		profileData.address = $('#address').val();
		console.log("$('#address').val();", $('#address').val())
		this.setState({
			profileData: profileData,
			editContact: false
		});
		this._saveChanges(e);
	}

	_uploadNewPhoto(file) {
	    
	    // create the container for our file data
	    var fileData = new FormData();
	    
	    // encode the file
	    fileData.append('img', file);

	    console.log("File data we sent: ", file);
	    return new Promise(function(resolve, reject) {
		    // Send AJAX request with form data
		    $.ajax({
		      type: "POST",
		      // specify the url we want to upload our file to
		      url: '/url/to/upload/to',
		      // this is how we pass in the actual file data from the form
		      data: fileData,
		      processData: false,
		      contentType: false,
		      success: resolve,
		      error: resolve
		    })
	    });
	}
	_uploadNewResume(file) {
	    
	    // create the container for our file data
	    var fileData = new FormData();
	    
	    // encode the file
	    fileData.append('resu', file);

	    console.log("File data we sent: ", file);
	    return new Promise(function(resolve, reject) {
		    // Send AJAX request with form data
		    $.ajax({
		      type: "POST",
		      // specify the url we want to upload our file to
		      url: '/url/to/upload',
		      // this is how we pass in the actual file data from the form
		      data: fileData,
		      processData: false,
		      contentType: false,
		      success: resolve,
		      error: resolve
		    })
	    });
	}
	
	_updateBio(e) {
		e.preventDefault();
		var profileData = this.state.profileData;

		// get a reference to the fileInput
	    var fileInput = $("#image");
	    if (fileInput[0].files.length > 0) {
	    	// so that you can get the file you wanted to upload 
		    var file = fileInput[0].files[0];
			this._uploadNewPhoto(file).then(function(JSONsentFromServer) {
		        // what do you do went it goes through
		        if (JSONsentFromServer.success) {
					console.log("[Message]", JSONsentFromServer.message);
		          	profileData.profileImageUrl = JSONsentFromServer.message
		        } else {
		        	console.log("[Error]", JSONsentFromServer.message);
		        }
			}.bind(this))
	    } 
	    var resumeInput = $("#resume")	    
	    if (resumeInput[0].files.length > 0) {
	    	// so that you can get the file you wanted to upload 
		    var file = resumeInput[0].files[0];
			this._uploadNewResume(file).then(function(JSONsentFromServer) {
		        // what do you do went it goes through
		        if (JSONsentFromServer.success) {
					console.log("[Message]", JSONsentFromServer.message);
		          	profileData.resumeImageUrl = JSONsentFromServer.message
		        } else {
		        	console.log("[Error]", JSONsentFromServer.message);
		        }
			}.bind(this))
	    } 
	    profileData.gender = $('#genderSelector').val();
	    profileData.description = $('#description').val();
		var languages = document.querySelectorAll(".checkbox > input:checked");
		profileData.specialty = Array.prototype.map.call(languages, function(input) {
			return input.value;
		})
		this.setState({
			profileData: profileData,
			editBio: false
		});
		this._saveChanges(e);
	}


	_saveChanges(e) {
		e.preventDefault();
		$.ajax({
			url: '/user/update-profile',
			type: 'POST',
			data: this.state.profileData,
			success: function(data) {
				console.log(data);
			},
			error: function(data) {
				console.log(data);
			}
		});
	}




	_editContact(isEnabled) {
		if(isEnabled) {
			return (
				<div className='panel panel-default'>
					<div className='panel-heading'>
						<h3 className="panel-title">Contact information</h3>
					</div>
					<div className='panel-body'>
						<div className="form-group row">
							<p className="col-sm-2 form-control-static"><b>Prénom:</b></p>
							<div className="col-sm-10">
								<input type="text" className="form-control" name="firstName" defaultValue={this.state.profileData.firstName} id="firstName"/>
							</div>
						</div>
						<div className="form-group row">
							<p className="col-sm-2 form-control-static"><b>Nom:</b></p>
							<div className="col-sm-10">
								<input type="text" className="form-control" name="lastName" defaultValue={this.state.profileData.lastName} id="lastName"/>
							</div>
						</div>
						<div className="form-group row">
						<p className="col-sm-2 form-control-static"><b>Email:</b></p>
						<div className="col-sm-10">
							<p className="form-control-static">{this.state.profileData.email}</p>
						</div>
						</div>
						<div className="form-group row">
							<p className="col-sm-2 form-control-static"><b>Téléphone:</b></p>
							<div className="col-sm-10">
								<input type="text" className="form-control" name="phone" defaultValue={this.state.profileData.phone} id="phone"/>
							</div>
						</div>
						<div className="form-group row">
							<p className="col-sm-2 form-control-static"><b>Adresse:</b></p>
							<div className="col-sm-8">

							<Geosuggest inputClassName="form-control" placeholder="" initialValue={this.state.profileData.address} id="address" />

							</div>
						</div>
						<button className="btn btn-success margin5 float-right" onClick={this._updateContact.bind(this)}>Save</button>
						<button className="btn btn-warning margin5 float-right" onClick={function() {this.setState({editContact: false, tempSpecialty:[]})}.bind(this)}>Cancel</button>
					</div>
				</div>
			);
		} else {
			return (
				<div className='panel panel-default'>
					<div className='panel-heading'>
						<h3 className="panel-title">Contact information</h3>
					</div>
					<div className='panel-body'>
						<div className="form-group row">
							<p className="col-sm-2 form-control-static"><b>Prénom:</b></p>
							<div className="col-sm-10">
								<p className="form-control-static">{this.state.profileData.firstName}</p>
							</div>
						</div>
						<div className="form-group row">
							<p className="col-sm-2 form-control-static"><b>Nom:</b></p>
							<div className="col-sm-10">
								<p className="form-control-static">{this.state.profileData.lastName}</p>
							</div>
						</div>
						<div className="form-group row">
						<p className="col-sm-2 form-control-static"><b>Email:</b></p>
						<div className="col-sm-10">
							<p className="form-control-static">{this.state.profileData.email}</p>
						</div>
						</div>
						<div className="form-group row">
							<p className="col-sm-2 form-control-static"><b>Téléphone:</b></p>
							<div className="col-sm-10">
								<p className="form-control-static">{this.state.profileData.phone}</p>
							</div>
						</div>
						<div className="form-group row">
							<p className="col-sm-2 form-control-static"><b>Adresse:</b></p>
							<div className="col-sm-10">
								<p className="form-control-static">{this.state.profileData.address}</p>
							</div>
						</div>
						<button className="btn btn-primary float-right" onClick={function() {this.setState({editContact: true})}.bind(this)}>Modifier</button>
					</div>
				</div>
			);
		}
	}

	 openLightBox(sourceUrl){
	 	console.log("sourceUrl", sourceUrl)
	 	this.setState({
	 		lightBox: sourceUrl
	 	})
	}
	 closeLightbox(){
	 	this.setState({
	 		lightBox: null
	 	})
	 }

	_editBio(isEnabled) {

		var buttonResume = null	    
	    if (this.state.profileData.resumeImageUrl){
	    	buttonResume = (
			<button className="btn btn-primary" width="150" onClick={this.openLightBox.bind(this, this.state.profileData.resumeImageUrl)}>View Resume</button>
			)
		}	

		if(this.state.lightBox){
			var box = (
                <Lightbox
                    mainSrc={this.state.lightBox}

                    onCloseRequest={this.closeLightbox.bind(this)}/>
            );

		} 

		if(isEnabled) {
			var specialtyContent = [];
			for(var i = 0; i < this.state.tempSpecialty.length; i++) {

				specialtyContent.push(
					<span className="specialty-span" key={i}>{this.state.tempSpecialty[i]} <span className='rem-specialty-btn'>×</span></span>
				);
			}

		


			var specialties = ['Bahasa Indonesia', 'Bahasa Malaysia', 'Bengali', 'Dansk', 'Deutsch', 'English', 'Español', 'Français', 'Hindi', 'Italiano',
			'Magyar', 'Nederlands', 'Norsk', 'Polski', 'Português', 'Punjabi', 'Sign Language', 'Suomi', 'Svenska', 'Tagalog', 'Türkçe', 'Čeština', 'Ελληνικά',
			'Русский', 'українська', 'עברית', 'العربية', 'ภาษาไทย', '中文', '日本語', '한국어'];

			console.log(this.state.tempSpecialty);

			var tempSpecialties = this.state.tempSpecialty;

			specialties = specialties.map(function(specialty) {
				var isSpecialityMine = tempSpecialties.indexOf(specialty) !== -1 ;
				return (
					<label className="checkbox">
						<input type="checkbox" value={specialty} defaultChecked={ (isSpecialityMine) ? true : false}/> {specialty}
					</label>
					)
			}, this)

			return (
				<div className='panel panel-default'>
					<div className='panel-heading'>
						<h3 className="panel-title">Bio</h3>
					</div>
					<div className='panel-body'>
						<div className="form-group row">
							<p className="col-sm-2 form-control-static"><b>Sexe:</b></p>
							<div className="col-sm-8">
								<select className="form-control" defaultValue={this.state.profileData.gender} id="genderSelector">
									<option value='Femme'>Femme</option>
									<option value='Homme'>Homme</option>
								</select>
							</div>
						</div>
						<div className="form-group row">
							<p className="col-sm-2 form-control-static"><b>Langues:</b></p>
							<div className="col-sm-8 languages_container">

								  {specialties}
								
							</div>
						</div>
						<div className="form-group row">
							<p className="col-sm-2 form-control-static"><b>Description:</b></p>
							<div className="col-sm-10">
								<input type="text" className="form-control" name="description" id="description" defaultValue={this.state.profileData.description} />
							</div>
						</div>
						<div className="form-group row">
							<p className="col-sm-2 form-control-static"><b>Photo:</b></p>
							<img src={this.state.profileData.profileImageUrl} width="150" />
							<div className="col-sm-10">
								<input type="file" accept="image/*" className="form-control" id="image" />
							</div>
						</div>
						<div className="form-group row">
							<p className="col-sm-2 form-control-static"><b>CV:</b></p>
							<img src={this.state.profileData.resumeImageUrl} width="150" />
							<div className="col-sm-10">
								<input type="file" accept="application/pdf, image/*" className="form-control" id="resume" />
							</div>
						</div>
						<button className="btn btn-success margin5 float-right" onClick={this._updateBio.bind(this)}>Save</button>
						<button className="btn btn-warning margin5 float-right" onClick={function() {this.setState({editBio: false})}.bind(this)}>Cancel</button>	
					</div>
				</div>
			);
		} else {
			var specialtyContent = [];
			for(var i = 0; i < this.state.profileData.specialty.length; i++) {
				if(i === this.state.profileData.specialty.length-1){
					specialtyContent.push(
					<span className="specialty-span" key={i}>{this.state.profileData.specialty[i]}</span>
				);
				} else{
				specialtyContent.push(
					<span className="specialty-span" key={i}>{this.state.profileData.specialty[i] + ", "}</span>
				);
				}
			}
			return (
				<div className='panel panel-default'>
					<div className='panel-heading'>
										{box}

						<h3 className="panel-title">Bio</h3>
					</div>
					<div className='panel-body'>
						<div className="form-group row">
							<p className="col-sm-2 form-control-static"><b>Sexe:</b></p>
							<div className="col-sm-10">
								<p className="form-control-static">{this.state.profileData.gender}</p>
							</div>
						</div>
						
						<div className="form-group row">
							<p className="col-sm-2 form-control-static"><b>Langues:</b></p>
							<div className="col-sm-10 languages_padding">
								{specialtyContent}
							</div>
						</div>
						<div className="form-group row">
							<p className="col-sm-2 form-control-static"><b>Description:</b></p>
							<div className="col-sm-10">
								<p className="form-control-static">{this.state.profileData.description}</p>
							</div>
						</div>
						<div className="form-group row">
							<p className="col-sm-2 form-control-static"><b>Photo:</b></p>
							<div className="col-sm-10">
								<img src={this.state.profileData.profileImageUrl} width="150" onClick={this.openLightBox.bind(this, this.state.profileData.profileImageUrl)} />
							</div>
						</div>
						<div className="form-group row">
							<p className="col-sm-2 form-control-static"><b>CV:</b></p>
							<div className="col-sm-10">
							{buttonResume}
							</div>
						</div>	
						<button className="btn btn-primary float-right" onClick={function() {this.setState({editBio: true, tempSpecialty: this.state.profileData.specialty.slice(0)})}.bind(this)}>Modifier</button>
					</div>
				</div>
			);
		}
	}

	
	render() {

		var contactForm = null;
		if(this.state.editContact) {
			contactForm = this._editContact(true);
		} else {
			contactForm = this._editContact(false);
		}

		var bioForm = null;
		if(this.state.editBio) {
			bioForm = this._editBio(true);
		} else {
			bioForm = this._editBio(false);
		}


		return (
			<div>
				<h3 className='center'>Edit profile</h3>
				<hr />
				{contactForm}
				<hr />
				{bioForm}			
			</div>
		);
	}
}


export default EditProfile;