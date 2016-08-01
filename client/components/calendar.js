// import React from "react"
// import Router from "react-router";
// import {Link} from "react-router";
// import BigCalendar from 'react-big-calendar';
// import moment from 'moment';

// BigCalendar.setLocalizer(
// 	BigCalendar.momentLocalizer(moment)
// );

// class Calendar extends React.Component {

// 	render() {

// 		return(
// 			<div>hello</div>
// 		);
// 	}

// }

// export default Calendar;

import React from 'react';
import BigCalendar from 'react-big-calendar';
import events from './events';
import moment from 'moment';

BigCalendar.setLocalizer(
	BigCalendar.momentLocalizer(moment)
);

function Event({ event }) {
  return (
    <span>
      <strong>
      {event.title}
      </strong>
      { event.desc && (':  ' + event.desc)}
    </span>
  )
}

function EventAgenda({ event }) {
  return <span>
    <em style={{ color: 'magenta'}}>{event.title}</em>
    <p>{ event.desc }</p>
  </span>
}


let Rendering = React.createClass({
  render(){
    return (
      <div {...this.props}>
        <BigCalendar
          events={events}
          defaultDate={new Date(2015, 3, 1)}
          defaultView='agenda'
          components={{
            event: Event,
            agenda: {
              event: EventAgenda
            }
          }}
        />
      </div>
    )
  }
})

export default Rendering;
