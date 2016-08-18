var React = require('react');
import { Link } from 'react-router'

var MessageUser = React.createClass({
 getInitialState: function() {
   return {
     messages: []
   }
 },

  componentDidMount(){
   $.ajax({
     url: '/conversation/' + this.props.params.id,
     dataType: 'json',
     type: 'GET',
     success: function(data) {
       console.log("got all messages", data)
       this.setState({
        messages:data
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

   var messageSquare = [];
   this.state.messages.forEach(function(message, i){
     var id=message.event._id;
     var address=message.event.address;

       messageSquare.push(
         <div className="square" id={id}>
               <div className="table">
                 <Link to={`/message/${id}`}>
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

   return (<div className="newmessage">
            <div className="container">
              <div className='panel panel-default'>
                <div className='panel-heading'>
                  <h3 className="panel-title">Messages</h3>
                </div>
                  <div className='panel-body'>
                    <div className="form-group row">
                      <div className="squaresContainer">{messageSquare}
                        <div className="form-group">
                          <label for="comment">Message:</label>
                          <textarea className="form-control" rows="5" id="comment"></textarea>
                          <button type="button" className="btn btn-primary" style={{"margin-top":"7px"}}>Send</button>
                        </div>
                      </div>
                    </div>
                  </div>
              </div>
            </div>
          </div>);
 },

});

MessageUser.contextTypes = {
  router: Object
}

module.exports = MessageUser
