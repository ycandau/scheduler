import React from 'react';
import classNames from 'classnames';

import 'components/DayListItem.scss';

//------------------------------------------------------------------------------
// Props:
//   - name: String
//   - spots: Number
//   - selected: Boolean
//   - setDay(): Function

const DayListItem = function (props) {
  const formatSpots = (spots) =>
    spots === 0 ? 'no spots' : spots === 1 ? '1 spot' : `${spots} spots`;

  const dayClass = classNames('day-list__item', {
    'day-list__item--selected': props.selected,
    'day-list__item--full': props.spots === 0,
  });

  return (
    <li className={dayClass} onClick={props.setDay} selected={props.selected}>
      <h2 className="text--regular">{props.name}</h2>
      <h3 className="text--light"> {formatSpots(props.spots)} remaining</h3>
    </li>
  );
};

export default DayListItem;
