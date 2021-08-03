import React from 'react';
import classNames from 'classnames';

import 'components/InterviewerListItem.scss';

//------------------------------------------------------------------------------
// Props:
//   - id: Number
//   - name: String
//   - avatar: String (url)
//   - selected: Boolean
//   - setInterviewer: Function

const InterviewerListItem = function (props) {
  const name = props.selected ? props.name : '';

  const interviewerClass = classNames('interviewers__item', {
    'interviewers__item--selected': props.selected,
  });

  return (
    <li
      className={interviewerClass}
      onClick={() => props.setInterviewer(props.name)}
    >
      <img
        className="interviewers__item-image"
        src={props.avatar}
        alt={props.name}
      />
      {name}
    </li>
  );
};

export default InterviewerListItem;
