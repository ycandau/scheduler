import React from 'react';
import classNames from 'classnames';

import 'components/DayListItem.scss';

//------------------------------------------------------------------------------

const DayListItem = ({ name, spots, selected, setDay }) => {
  const formatSpots = (spt) =>
    spt === 0 ? 'no spots' : spt === 1 ? '1 spot' : `${spt} spots`;

  const dayClass = classNames('day-list__item', {
    'day-list__item--selected': selected,
    'day-list__item--full': spots === 0,
  });

  return (
    <li
      className={dayClass}
      onClick={setDay}
      selected={selected}
      data-testid="day"
    >
      <h2 className="text--regular">{name}</h2>
      <h3 className="text--light"> {formatSpots(spots)} remaining</h3>
    </li>
  );
};

export default DayListItem;
