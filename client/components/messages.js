var React = require('react');
import { Link } from 'react-router'

var Messages = React.createClass({
 getInitialState: function() {
   return {
     messages: [],
     conversations:[]
   }
 },

  componentDidMount(){
   $.ajax({
     url: '/messages',
     dataType: 'json',
     type: 'GET',
     success: function(data) {
       console.log("got all messages", data)
       this.setState({
        conversations:data
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
   this.state.conversations.forEach(function(conversation, i){
     

       messageSquare.push(
         <div className="square">
               <div className="table">
                 <Link to={`/conversation/${conversation._id}`}>Go to ceonversation</Link>
                       <div className="location">
                          <span className="backed">
                           
                           {conversation.from}

                          </span>
                       </div>
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
                      <div className="squaresContainer">{messageSquare}</div>
                    </div>
                  </div>
              </div>
            </div>
          </div>);
 },

});

Messages.contextTypes = {
  router: Object
}

module.exports = Messages
