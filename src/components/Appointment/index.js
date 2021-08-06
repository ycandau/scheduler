import React from 'react';

import './styles.scss';

import Confirm from './Confirm';
import Empty from './Empty';
import Error from './Error';
import Form from './Form';
import Header from './Header';
import Show from './Show';
import Status from './Status';

import useVisualMode from '../../hooks/useVisualMode';

//------------------------------------------------------------------------------
// Props:
//   - id: Number
//   - time: String
//   - interview: Object
//   - interviewers: Array
//   - bookInterview(): Function
//   - cancelInterview(): Function

const Appointment = (props) => {
  const CONFIRM = 'CONFIRM';
  const EMPTY = 'EMPTY';
  const ERROR = 'ERROR';
  const CREATE = 'CREATE';
  const EDIT = 'EDIT';
  const SHOW = 'SHOW';
  const SAVING = 'SAVING';
  const DELETING = 'DELETE';

  // Use custom hook to manage display mode
  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  // Define state transition handlers
  const onCancel = () => back();
  const onAdd = () => transition(CREATE);
  const onEdit = () => transition(EDIT);
  const onDelete = () => transition(CONFIRM);

  const onSave = (name, interviewerId) => {
    transition(SAVING);
    props
      .bookInterview(props.id, { student: name, interviewer: interviewerId })
      .then(() => transition(SHOW));
  };

  const onConfirm = () => {
    transition(DELETING);
    props.cancelInterview(props.id).then(() => transition(EMPTY));
  };

  // Assemble component
  return (
    <article className="appointment">
      <Header time={props.time} />
      {mode === EMPTY && <Empty onAdd={onAdd} />}
      {mode === SAVING && <Status message="Saving" />}
      {mode === DELETING && <Status message="Deleting" />}
      {mode === SHOW && (
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      )}
      {mode === CREATE && (
        <Form
          interviewers={props.interviewers}
          onSave={onSave}
          onCancel={onCancel}
        />
      )}
      {mode === EDIT && (
        <Form
          name={props.interview.student}
          interviewerId={props.interview.interviewer.id}
          interviewers={props.interviewers}
          onSave={onSave}
          onCancel={onCancel}
        />
      )}
      {mode === CONFIRM && (
        <Confirm
          message="Delete the appointment?"
          onConfirm={onConfirm}
          onCancel={onCancel}
        />
      )}
    </article>
  );
};

export default Appointment;
