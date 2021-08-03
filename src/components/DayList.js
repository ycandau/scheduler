import React from 'react';
import DayListItem from './DayListItem';

//------------------------------------------------------------------------------
// Props:
//   - days: Array
//   - value: String
//   - onChange(): Function

const DayList = (props) => (
  <ul>
    {props.days.map((day) => (
      <DayListItem
        key={day.id}
        name={day.name}
        spots={day.spots}
        selected={day.name === props.value}
        setDay={(event) => props.onChange(day.name)}
      />
    ))}
  </ul>
);

export default DayList;
