var React = require('react');
import { hashHistory, Router, Route, Link, withRouter } from 'react-router'
var Search = React.createClass({
 getInitialState: function() {
   return {
     users: [],
     event:{}
   }
 },

 componentDidMount: function(){
  var that = this
  var id =this.props.params.id;
   $.ajax({
     url: '/event/'+id,
     dataType: 'json',
     type: 'GET',
     success: function(data) {
       console.log("got the event", data)
       that.setState({
        event:data
       });
    $.ajax({
      url: '/search',
      dataType: 'json',
      type: 'POST',
      data: {address: data.event.address},
      success: function(users){
        that.setState({
          users:users
        })
        console.log("users", users) 
      },
      error: function(err){
        console.log("error")
      }
    })   
     },
     error: function(xhr, status, err) {
      console.log("error")
     }.bind(this)
   });
 },


 render: function(){
   console.log("RENDERING");

   var userSquare = [];
   this.state.users.forEach(function(user, i){
     var img = user.profileImageUrl;
     var id = user._id;
       userSquare.push(
       // <Link to={'/artists/'+id} key = {i} style={{margin:"10px"}}>
       //   <div className="square" id={user._id}>
       //     <div className="content bg" style={{backgroundImage: 'url('+img+')'}}>
       //         <div className="table">
       //             <div className="table-cell"><span className="backed">{user.name}</span></div>
       //         </div>
       //     </div>
       //   </div>
       // </Link>
       

       <div className="col-sm-1 col-sm-offset-1" >              
         <div className="img"><img src={user.profileImageUrl} alt="Image" /></div>
         <div className="text_image"><h4>{user.firstName}</h4>
         </div>
       </div>


     );
   }.bind(this));
   return <div>

   <div className='panel panel-default'>
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
          </div>
          <div className='panel-body'>
            <div className="form-group row">

   <div className="squaresContainer">{userSquare}</div>

        </div>
       </div>
       </div>

   </div>
 }
});

module.exports = Search