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

module.exports = Search
