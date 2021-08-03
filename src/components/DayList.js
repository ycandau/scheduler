import React from 'react';
import DayListItem from './DayListItem';

//------------------------------------------------------------------------------
// Props:
//   - days: Array
//   - day: String
//   - setDay(): Function

const DayList = function (props) {
  const dayListItems = props.days.map((day) => (
    <DayListItem
      key={day.id}
      name={day.name}
      spots={day.spots}
      selected={props.day === day.name}
      setDay={props.setDay}
    ></DayListItem>
  ));

  return <ul>{dayListItems}</ul>;
};

export default DayList;
