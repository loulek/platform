import React from "react";
import {Link} from "react-router";

class Art extends React.Component {
	constructor(props) {
		super(props);
		this.state={
		art:{}
	}
	}

	componentDidMount() {
	    $.ajax({
	      url: '/art/' + this.props.params.id,
	      dataType: 'json',
	      type: 'GET',
	      success: function(response) {
	        console.log("success finding art", response)
	        this.setState({
				art: response.arto
			})
	      }.bind(this),
	      error: function(err){
	        console.log(err,"hereeeee")
	      }

	    });
  	}

	handleClick(e){
		e.preventDefault();
		var num=this.state.art.phone
		console.log("thisclick", this)
		$.ajax({
			url: '/contact',
			dataType: 'json',
			type: 'POST',
			data: {
				num:num,
				message: "hi"},
			success: function(resp){
				console.log("resp from twilio", resp)
				if (resp.success){
					alert("success!")
				}
			},
			error: function(err){
				console.log("error",err)
			}
		})
	}

	sendmessage(e){
		e.preventDefault();
		var user = this.context.getUser();
		if(user.type === "Client" || user.type === "Profile"){
			$.ajax({
				url: '/sendMessage',
				dataType: 'json',
				type: 'POST',
				data: this.state,
					success: function(data) {
						if(data.success === true) {
							console.log("IT IS A GIANT SUCCESS")
							this.context.router.push(data.redirect);
						} else if(data.status === 'error') {
							this.setState({
								message: data.error
							});
						}
					}.bind(this),
					error: function(hello, status, err){
						this.setState({
							message: "Error sending a message"
						});
					}.bind(this)
			});
		} else {
			this.context.router.push({
			pathname: '/login'
			})
		}
	}








	render() {
		return (
			<div className="container">
				<div className="panel panel-default">
					<div className='panel-heading'>
						<h3 className="panel-title">MasterPiece</h3>
					</div>
						<div className='panel-body'>
							<div className='form-group row'>
								<div className="squaresContainer">	
									<div className="row col-md-4"><img src={this.state.art.artImageUrl} alt="Image" width="200px"/>
									</div>
									<div className="row col-md-5">
									<h2>{this.state.art.title}</h2>
									<h3>{this.state.art.artist}</h3>
									</div>
									<div className="row col-md-10">
										<h4>CATEGORY</h4>
										<h5><p>{this.state.art.category}</p>
										</h5>
										<h4>DIMENSIONS</h4>
										<h5><p>{this.state.art.height} in. H x {this.state.art.width} in. W</p>
										</h5>
										<h4>RENTAL PRICE FROM</h4>
										<h5><p>$ {this.state.art.price}</p>
										</h5>
										<h4>MUSEUM LOCATION</h4>
										<h5><p>{this.state.art.address}</p>
										</h5>



									</div>
								 </div>
							</div>
							 <button className="btn btn-primary" onClick={this.sendmessage.bind(this)}>Request More Info</button>
								
						</div>	
				</div>
			</div>
		);
	}
}

Art.contextTypes = {
  router: React.PropTypes.object,
  getUser: React.PropTypes.func
}

module.exports = Art;