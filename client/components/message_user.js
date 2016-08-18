var React = require('react');
import { Link } from 'react-router'

var MessageUser = React.createClass({
 getInitialState: function() {
  console.log("THISSSS CONTEXTTTT", this.context)
   return {
     messages: [],
     message: ''
   };
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

send: function() {
    $.ajax({
     url: '/sendMessage/' + this.props.params.id,
     dataType: 'json',
     type: 'POST',
     data: {
      message: this.state.message
     },
     success: function(data) {
       console.log("got all messages", data)
       this.setState({
        messages:data.msgs
       });
     }.bind(this),
     error: function(xhr, status, err) {
      console.log("error");
     }
   });
  },

onChange: function(e) {
  // this function should take the new value, e.target.value, and set the state 'message' to it
  // use setState
  console.log("THISsssss", this)
 this.setState({
  message: e.target.value
 }) 
},


 render: function(){
   var messageSquare = [];
   this.state.messages.forEach(function(message, i){

       messageSquare.push(
         <div className="square">
               <div className="table">
                
                {message.from}
                {message.to}
                {message.message}
                {message.time}
                 
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
                          <textarea className="form-control" rows="5" defaultValue={this.state.message} onChange={this.onChange}></textarea>
                          <button type="button" className="btn btn-primary" style={{"margin-top":"7px"}} onClick={this.send}>Send</button>
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
  router: React.PropTypes.object
}

module.exports = MessageUser
