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

const Appointment = ({
  id,
  time,
  interview,
  interviewers,
  bookInterview,
  cancelInterview,
}) => {
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
  const { mode, transition, back } = useVisualMode(interview ? SHOW : EMPTY);

  // Define state transition handlers
  const onCancel = () => back();
  const onAdd = () => transition(CREATE);
  const onEdit = () => transition(EDIT);
  const onDelete = () => transition(CONFIRM);

  const onSave = (name, interviewerId) => {
    const interview = { student: name, interviewer: interviewerId };
    const replace = true;
    transition(SAVING);
    bookInterview(id, interview)
      .then(() => transition(SHOW))
      .catch((err) => transition(ERROR_SAVE, replace));
  };

  const onConfirm = () => {
    const replace = true;
    transition(DELETING, replace);
    cancelInterview(id)
      .then(() => transition(EMPTY))
      .catch((err) => transition(ERROR_DELETE, replace));
  };

  // Use effect hook to update mode on websocket messages
  useEffect(() => {
    if (interview && mode === EMPTY) transition(SHOW);
    if (interview === null && mode === SHOW) transition(EMPTY);
  }, [interview, transition, mode]);

  // Assemble component
  return (
    <article className="appointment" data-testid="appointment">
      <Header time={time} />
      {mode === EMPTY && <Empty onAdd={onAdd} />}
      {mode === SAVING && <Status message="Saving" />}
      {mode === DELETING && <Status message="Deleting" />}
      {mode === SHOW && interview && (
        <Show
          student={interview.student}
          interviewer={interview.interviewer}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      )}
      {mode === CREATE && (
        <Form interviewers={interviewers} onSave={onSave} onCancel={onCancel} />
      )}
      {mode === EDIT && (
        <Form
          name={interview.student}
          interviewerId={interview.interviewer.id}
          interviewers={interviewers}
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
