var React = require('react');
import { Link } from 'react-router'

var Notifications = React.createClass({
 getInitialState: function() {
   return {
     notifications: []
   }
 },

  componentDidMount(){
   $.ajax({
     url: '/notifications',
     dataType: 'json',
     type: 'GET',
     success: function(data) {
       console.log("got all notifications", data)
       this.setState({
        notifications:data
       });
     }.bind(this),
     error: function(xhr, status, err) {
      console.log("error");
     }
   });
 },

 // $.ajax({
 //     url: '/event/:id',
 //     dataType: 'json',
 //     type: 'GET',
 //     success: function(data) {
 //       console.log("got all notifications", data)
 //       var arr=this.state.notifications;
 //       arr.push(data)
 //       this.setstate({
 //       notifications:arr
 //      )}
 //     }.bind(this),
 //     error: function(xhr, status, err) {
 //      console.log("error");
 //     }
 //   });


 render: function(){
   console.log("RENDERING", this.state.notifications);

   var notificationSquare = [];
   this.state.notifications.forEach(function(notification, i){
     var id=notification.event._id;
     var address=notification.event.address;

       notificationSquare.push(
         <div className="square" id={id}>
               <div className="table">
                 <Link to={`/event/${id}`}>
                       <div className="location">
                          <span className="backed">
                           
                           {address}

                          </span>
                       </div>
              
                 </Link>
               </div>
         </div>
     );
   }.bind(this))

   return (<div>
            <div className="container">
              <div className='panel panel-default'>
                <div className='panel-heading'>
                  <h3 className="panel-title">Notifications</h3>
                </div>
                  <div className='panel-body'>
                    <div className="form-group row">
                      <div className="squaresContainer">{notificationSquare}</div>
                    </div>
                  </div>
              </div>
            </div>
          </div>);
 },

});

Notifications.contextTypes = {
  router: Object
}

module.exports = Notifications
