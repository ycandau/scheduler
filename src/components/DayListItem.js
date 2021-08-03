import React from 'react';
import classNames from 'classnames';

import 'components/DayListItem.scss';

//------------------------------------------------------------------------------

const DayListItem = function (props) {
  const spots = props.spots === 1 ? 'spot' : 'spots';

  const dayClass = classNames('day-list__item', {
    'day-list__item--selected': props.selected,
    'day-list__item--full': props.spots === 0,
  });

  return (
    <li
      className={dayClass}
      onClick={() => props.setDay(props.name)}
      selected={props.selected}
    >
      <h2 className="text--regular">{props.name}</h2>
      <h3 className="text--light">
        {props.spots} {spots} remaining
      </h3>
    </li>
  );
};

export default DayListItem;
