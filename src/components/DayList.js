import React from 'react';
import DayListItem from './DayListItem';

//------------------------------------------------------------------------------

const DayList = ({ days, value, onChange }) => (
  <ul>
    {days.map((day) => (
      <DayListItem
        key={day.id}
        name={day.name}
        spots={day.spots}
        selected={day.name === value}
        setDay={(event) => onChange(day.name)}
      />
    ))}
  </ul>
);

export default DayList;
