import React from 'react';

import './styles.scss';

import Confirm from './Confirm';
import Empty from './Empty';
import Error from './Error';
import Form from './Form';
import Header from './Header';
import Show from './Show';
import Status from './Status';

import { useEffect } from 'react';
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
  // Constants
  const EMPTY = 'EMPTY';
  const SHOW = 'SHOW';
  const CREATE = 'CREATE';
  const EDIT = 'EDIT';
  const CONFIRM = 'CONFIRM';
  const SAVING = 'SAVING';
  const DELETING = 'DELETING';
  const ERROR_SAVE = 'ERROR_SAVE';
  const ERROR_DELETE = 'ERROR_DELETE';

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
    const interview = { student: name, interviewer: interviewerId };
    const replace = true;
    transition(SAVING);
    props
      .bookInterview(props.id, interview)
      .then(() => transition(SHOW))
      .catch((err) => transition(ERROR_SAVE, replace));
  };

  const onConfirm = () => {
    const replace = true;
    transition(DELETING, replace);
    props
      .cancelInterview(props.id)
      .then(() => transition(EMPTY))
      .catch((err) => transition(ERROR_DELETE, replace));
  };

  // Use effect hook to update mode on websocket messages
  useEffect(() => {
    if (props.interview && mode === EMPTY) transition(SHOW);
    if (props.interview === null && mode === SHOW) transition(EMPTY);
  }, [props.interview, transition, mode]);

  // Assemble component
  return (
    <article className="appointment">
      <Header time={props.time} />
      {mode === EMPTY && <Empty onAdd={onAdd} />}
      {mode === SAVING && <Status message="Saving" />}
      {mode === DELETING && <Status message="Deleting" />}
      {mode === SHOW && props.interview && (
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
      {mode === ERROR_SAVE && (
        <Error message="Could not book the appointment." onClose={onCancel} />
      )}
      {mode === ERROR_DELETE && (
        <Error message="Could not cancel the appointment." onClose={onCancel} />
      )}
    </article>
  );
};

export default Appointment;
