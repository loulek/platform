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
   console.log("RENDERING", this.state.events);

   var userSquare = [];
   this.state.events.forEach(function(e, i){
     var address = e.address;
     var startDate = e.startDate;
     var endDate=e.endDate;
     var startHour=e.startHour;
     var endHour=e.endHour;
     var id=e._id
       userSquare.push(
       <Link to={'/events/'+id} key = {i} style={{margin:"10px"}}>
         <div className="square" id={e._id}>
               <div className="table">
                   <div className="location"><span className="backed">{address}</span></div>
                   <div className="time"> <span className="backed"> From {startDate} {startHour} To {endDate} {endHour}</span></div>
               </div>
         </div>
       </Link>
     );
   }.bind(this));
   return <div>

   <div className='panel panel-default'>
          <div className='panel-heading'>
            <h3 className="panel-title">Events</h3>
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