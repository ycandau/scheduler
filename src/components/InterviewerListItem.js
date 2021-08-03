import React from 'react';
import classNames from 'classnames';

import 'components/InterviewerListItem.scss';

//------------------------------------------------------------------------------
// Props:
//   - name: String
//   - avatar: String (url)
//   - selected: Boolean
//   - setInterviewer(): Function

const InterviewerListItem = function (props) {
  const interviewerClass = classNames('interviewers__item', {
    'interviewers__item--selected': props.selected,
  });

  return (
    <li className={interviewerClass} onClick={props.setInterviewer}>
      <img
        className="interviewers__item-image"
        src={props.avatar}
        alt={props.name}
      />
      {props.selected && props.name}
    </li>
  );
};

export default InterviewerListItem;
