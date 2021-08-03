import React from 'react';

import './styles.scss';

import Header from './Header';
import Show from './Show';
import Empty from './Empty';

//------------------------------------------------------------------------------
// Props:
//   - time: String
//   - interview: Object
//   - onEdit(): Function
//   - onDelete(): Function

const Appointment = function (props) {
  const content = props.interview ? (
    <Show
      student={props.interview.student}
      interviewer={props.interview.interviewer}
      onEdit={props.onEdit}
      onDelete={props.onDelete}
    />
  ) : (
    <Empty onAdd={props.onAdd} />
  );

  return (
    <article className="appointment">
      <Header time={props.time} />
      {content}
    </article>
  );
};

export default Appointment;
