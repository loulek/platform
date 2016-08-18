import React from "react";
import {Link} from "react-router";
import Modal from 'react-modal';
import Geosuggest from 'react-geosuggest';


class Addart extends React.Component {
	constructor(props) {
		super(props);
		console.log("I AM IN THE CONSTRUCTOR")
		this.state = {
			artData: {
				_id: null,
				title: null,
				artist: null,
				artImageUrl: null,
				category: null,
				price: null,
				height: null,
				width: null,
				location: null,
				address: null,
				description: null
			},
			art: [],
			open:false,
			openEdit: false,
			selected: {}
		}	
	}

	componentDidMount(){

	$.ajax({
		url: '/myGallery',
		dataType: 'json',
		type: 'GET',
		data: {	artData: this.state.artData
		},
		success: function(response){
			console.log(response);
			this.setState({
				art: response
			})
		}.bind(this),
		error: function(err){
			console.log("error")
		}
	})
};

	addArt(e){
		e.preventDefault;
		this.setState({
			open: true,
			selected: {}
		})
	}

	editArt(item, e){
		console.log('item clicked', item);
		e.preventDefault;
		this.setState({
			openEdit:true,
			selected: item
		})
	}

	saveArt(e){
		e.preventDefault;
		var artData = this.state.selected;

		var fileInput = $("#artImageUrl");
	    if (fileInput[0].files.length > 0) {
	    	// so that you can get the file you wanted to upload
		    var file = fileInput[0].files[0];
			this.uploadNewPhoto(file).then(function(JSONsentFromServer) {
				console.log("Sending data to server");
		        // what do you do went it goes through
		        if (JSONsentFromServer.success) {
					console.log("[Message]", JSONsentFromServer.message);
		          	artData.artImageUrl = JSONsentFromServer.message;

		          	$.ajax({
						url: '/addArt',
						type: 'POST',
						data: artData,
						success: function(data) {
							console.log("data received, successful save",data);
							this.setState({
								art: data.art,
								open: false
							})
						}.bind(this),
						error: function(data) {
							console.log(data);
						}
					});
		        } else {
		        	console.log("[Error]", JSONsentFromServer.message);
		        }
			}.bind(this))
	    }
	}

	updateArt(e){
		e.preventDefault;

		var fileInput = $("#artImageUrl");
	    if (fileInput[0].files.length > 0) {
	    	// so that you can get the file you wanted to upload
		    var file = fileInput[0].files[0];
			this.uploadNewPhoto(file).then(function(JSONsentFromServer) {
		        // what do you do went it goes through
		        if (JSONsentFromServer.success) {
					console.log("[Message]", JSONsentFromServer.message);
		          	this.setState({
		          		selected: Object.assign({}, this.state.selected, {artImageUrl: JSONsentFromServer.message})
		          	})
					console.log("HERE IA AM IN REQUEST 2")
					this.saveChanges(e);
		        } else {
		        	console.log("[Error]", JSONsentFromServer.message);
		        }
			}.bind(this))
	    } else {
	    	this.saveChanges(e);
	    }
	}

	deleteArt(e){
		var arr = [].concat(this.state.art)
		for (var i = 0 ; i < arr.length; i++){
			if(arr[i]._id === this.state.selected._id){
			arr.splice(i, 1)
			return $.ajax({
						url:'/deleteArt/'+ this.state.selected._id,
						method: 'delete',
						success: function() {
							this.setState({
								art: arr,
								openEdit: false
							})
						}.bind(this)
					})
				 
			}
		}
	}

	saveChanges(e){
		 var altogether = Object.assign({}, this.state.artData, this.state.selected);
		 console.log("altogether", altogether);
		 console.log("THIS STATE SELECTED", this.state.selected)

	$.ajax({
		url: '/updateArt/'+ this.state.selected._id,
		type: 'POST',
		data: this.state.selected,
		success: function(data) {
			console.log("[data]", data);
			var  arr = [].concat(this.state.art)
			for (var i=0; i < arr.length; i++){
				if(arr[i]._id === data.hello._id){
					arr[i] = data.hello;
					break;
				}
			}
			this.setState({
				selected: data.hello,
				openEdit: false,
				art : arr
			})

		}.bind(this),
		error: function(data) {
			console.log(data);
		}
	});

	}


	uploadNewPhoto(file) {
	    return new Promise(function(resolve, reject) {
	    	console.log("Sending image to server");
	    	// create the container for our file data
		    var fileData = new FormData();
		    // encode the file
		    fileData.append('img', file);

		    // Send AJAX request with form data
		    $.ajax({
		      type: "POST",
		      // specify the url we want to upload our file to
		      url: '/url/to/upload/to/art',
		      // this is how we pass in the actual file data from the form
		      data: fileData,
		      processData: false,
		      contentType: false,
		      success: resolve,
		      error: reject
		    })
	    });
	}
	onChangeArt(e){
		if(e.target.name==="artImageUrl"){
			var input = e.target
			var fReader = new FileReader();
			fReader.readAsDataURL(input.files[0]);
			fReader.onloadend = function(event){
			this.setState({selected:Object.assign({}, this.state.selected, {artImageUrl : event.target.result})})
			}.bind(this)
		} else {
		var selected = {};
		selected[e.target.name] = e.target.value	
		this.setState({selected: Object.assign({},this.state.selected,selected)})
		}	
	}
	suggestSelect(e) {
		var selected = Object.assign({}, this.state.selected, { address: e.label })
		this.setState({selected: selected})
	}
	render() {
	console.log("SELECTED", this.state.selected)
		return (
			<div>
				<div style={{marginLeft:"20px"}}>
					<h3>My Gallery <button className="btn btn-default" onClick={this.addArt.bind(this)}>Add Art</button></h3>
				</div>
					<div className="art-display">
						{
							this.state.art.map((item, i) => { 
								return <div key={"art-" + i} className="individual-art art-display" onClick={this.editArt.bind(this, item)}><img src={item.artImageUrl} /></div>
							})
						}
						<Modal
					  isOpen={this.state.open}
					  onRequestClose={() => {}}
					  style={{overlay : {
							    position          : 'fixed',
							    top               : 0,
							    left              : 0,
							    right             : 0,
							    bottom            : 0,
							    backgroundColor   : 'rgba(255, 255, 255, 0.75)'
							  },
							  content : {
							    position                   : 'absolute',
							    top                        : '40px',
							    left                       : '40px',
							    right                      : '40px',
							    bottom                     : '40px',
							    border                     : '1px solid #ccc',
							    background                 : '#fff',
							    overflow                   : 'auto',
							    WebkitOverflowScrolling    : 'touch',
							    borderRadius               : '4px',
							    outline                    : 'none',
							    padding                    : '20px'
							 
							  }
							}}
					>
					  <h2>Add Art</h2>
					  	<p>
						  <div>
						    <div className="form-group row">
							  	<div className="col-sm-10">
									<input type="text" className="form-control" name="title" placeholder="Title" onChange={this.onChangeArt.bind(this)} />
								</div>
							</div>
							<div className="form-group row">
								<div className="col-sm-10">
									<input type="text" className="form-control" name="artist" placeholder="Artist" onChange={this.onChangeArt.bind(this)} />
								</div>
							</div>
							<div className="form-group row">
								<div className="col-sm-10">
									<input type="text" className="form-control" name="description" placeholder="Description" onChange={this.onChangeArt.bind(this)} />
								</div>
							</div>
							<div className="form-group row">	
								<div className="col-sm-10">
									<select className="form-control" name="category" onChange={this.onChangeArt.bind(this)} >
										<option value="" selected disabled>Category</option>
										<option value='Painting'>Painting</option>
										<option value='Photography'>Photography</option>
										<option value='Prints'>Prints</option>
										<option value='Sculptures'>Sculptures</option>
										<option value='Drawings'>Drawings</option>
										<option value='More Art'>More Art</option>
									</select>
								</div>
							</div>
							<div className="form-group row">	
								<div className="col-sm-10">
									<input type="text" className="form-control" name="price" placeholder="Price" onChange={this.onChangeArt.bind(this)} />
								</div>
							</div>
							<div className="form-group row">	
								<div className="col-sm-10">
									<input type="text" className="form-control" name="height" placeholder="Height (inches)" onChange={this.onChangeArt.bind(this)} />
								</div>
							</div>
							<div className="form-group row">	
								<div className="col-sm-10">
									<input type="text" className="form-control" name="width" placeholder="Width (inches)" onChange={this.onChangeArt.bind(this)} />
								</div>
							</div>
							<div className="form-group row">	
								<div className="col-sm-6 col-md-10">
									<Geosuggest inputClassName="form-control" id="address" placeholder="Location (City)" onSuggestSelect={this.suggestSelect.bind(this)}  />
								</div>
							</div>
							<div className="form-group row">
							  <img src={this.state.selected.artImageUrl} width="200" />
					   			<div className="col-sm-10">
									<input type="file" accept="image/*" className="form-control" id="artImageUrl" name="artImageUrl" onChange={this.onChangeArt.bind(this)} />
								</div>
							</div>
							<div className="form-group row">	
								<button className="btn btn-primary" style={{marginRight:'20px'}} onClick={this.saveArt.bind(this)}>Save</button>
								<button className="btn btn-primary" style={{marginRight:'20px'}} onClick={() => this.setState({open: false}) }>Cancel</button>

							</div>			
						  </div>
						</p>
					</Modal>
					<Modal
					  isOpen={this.state.openEdit}
					  onRequestClose={() => {}}
					  style={{overlay : {
							    position          : 'fixed',
							    top               : 0,
							    left              : 0,
							    right             : 0,
							    bottom            : 0,
							    backgroundColor   : 'rgba(255, 255, 255, 0.75)'
							  },
							  content : {
							    position                   : 'absolute',
							    top                        : '40px',
							    left                       : '40px',
							    right                      : '40px',
							    bottom                     : '40px',
							    border                     : '1px solid #ccc',
							    background                 : '#fff',
							    overflow                   : 'auto',
							    WebkitOverflowScrolling    : 'touch',
							    borderRadius               : '4px',
							    outline                    : 'none',
							    padding                    : '20px'
							 
							  }
							}}
					>
					<h2>Edit Art</h2>
					  	<p>
						  <div>
						    <div className="form-group row">
							  	<div className="col-sm-10">
									<input type="text" className="form-control" name="title" placeholder="Title" onChange={this.onChangeArt.bind(this)} defaultValue={this.state.selected.title} />
								</div>
							</div>
							<div className="form-group row">
								<div className="col-sm-10">
									<input type="text" className="form-control" name="artist" placeholder="Artist" onChange={this.onChangeArt.bind(this)} defaultValue={this.state.selected.artist} />
								</div>
							</div>
							<div className="form-group row">
								<div className="col-sm-10">
									<input type="text" className="form-control" name="description" placeholder="Description" onChange={this.onChangeArt.bind(this)} defaultValue={this.state.selected.description} />
								</div>
							</div>
							<div className="form-group row">	
								<div className="col-sm-10">
									<select className="form-control" name="category" onChange={this.onChangeArt.bind(this)} defaultValue={this.state.selected.category} >
										<option value="" selected disabled>Category</option>
										<option value='Painting'>Painting</option>
										<option value='Photography'>Photography</option>
										<option value='Prints'>Prints</option>
										<option value='Sculptures'>Sculptures</option>
										<option value='Drawings'>Drawings</option>
										<option value='More Art'>More Art</option>
									</select>
								</div>
							</div>
							<div className="form-group row">	
								<div className="col-sm-10">
									<input type="text" className="form-control" name="price" placeholder="Price" onChange={this.onChangeArt.bind(this)} defaultValue={this.state.selected.price} />
								</div>
							</div>
							<div className="form-group row">	
								<div className="col-sm-10">
									<input type="text" className="form-control" name="height" placeholder="Height (inches)" onChange={this.onChangeArt.bind(this)} defaultValue={this.state.selected.height} />
								</div>
							</div>
							<div className="form-group row">	
								<div className="col-sm-10">
									<input type="text" className="form-control" name="width" placeholder="Width (inches)" onChange={this.onChangeArt.bind(this)} defaultValue={this.state.selected.width} />
								</div>
							</div>
							<div className="form-group row">	
								<div className="col-sm-6 col-md-10">
									<Geosuggest inputClassName="form-control" id="address" placeholder="Location (City)" onSuggestSelect={this.suggestSelect.bind(this)} initialValue={this.state.selected.address} />
								</div>
							</div>
							<div className="form-group row">
							  <img src={this.state.selected.artImageUrl} width="200" />
					   			<div className="col-sm-10">
									<input type="file" accept="image/*" className="form-control" id="artImageUrl" name="artImageUrl" onChange={this.onChangeArt.bind(this)} />
								</div>
							</div>
							<div className="form-group row">
								<button className="btn btn-primary" style={{marginRight:'20px', marginLeft:'12px'}} onClick={this.updateArt.bind(this)}>Save</button>	
								<button className="btn btn-primary" style={{marginRight:'20px'}} onClick={() => this.setState({openEdit: false}) }>Cancel</button>
								<button className="btn btn-primary" style={{marginRight:'20px'}} onClick={this.deleteArt.bind(this)}>Delete</button>
							</div>			
						  </div>
						</p>
					</Modal>

				</div>		
			</div>	
		);
	}
}

				






Addart.contextTypes = {
    router: React.PropTypes.object.isRequired
};

export default Addart;

