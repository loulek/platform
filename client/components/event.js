var React = require('react');
import { hashHistory, Router, Route, Link, withRouter } from 'react-router'
var Events = React.createClass({
 getInitialState: function() {
   return {
     events: []
   }
 },

 componentDidMount: function(){
  var that = this
   $.ajax({
     url: '/events',
     dataType: 'json',
     type: 'GET',
     success: function(data) {
       console.log("got all events", data)
       that.setState({
        events:data
       });
     },
     error: function(xhr, status, err) {
      console.log("error")
     }.bind(this)
   });
 },


 render: function(){
   console.log("RENDERING");

   var userSquare = [];
   this.state.events.forEach(function(e, i){
     var address = e.address;
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
            <h3 className="panel-title">Hôtesses</h3>
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

module.exports = Events
