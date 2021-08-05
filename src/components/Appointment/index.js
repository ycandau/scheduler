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
//   - bookInterview: Function()

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
  const add = () => transition(CREATE);
  const cancel = () => back();

  const save = (name, interviewer) => {
    transition(SAVING);
    props
      .bookInterview(props.id, { student: name, interviewer })
      .then(() => transition(SHOW));
  };

  // Assemble component
  return (
    <article className="appointment">
      <Header time={props.time} />
      {mode === EMPTY && <Empty onAdd={add} />}
      {mode === SHOW && (
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer}
          onEdit={props.onEdit}
          onDelete={props.onDelete}
        />
      )}
      {mode === CREATE && (
        <Form
          interviewers={props.interviewers}
          onSave={save}
          onCancel={cancel}
        />
      )}
      {mode === SAVING && <Status message="Saving" />}
      {mode === DELETING && <Status message="Deleting" />}
      {/* {mode === EDIT && (
        <Form
          name="Lydia Miller-Jones"
          interviewers={props.interview.interviewer}
          interviewer={2}
          onSave={'onSave'}
          onCancel={'onCancel'}
        />
      )}
      {mode === CONFIRM && (
        <Confirm
          message="Delete the appointment?"
          onConfirm={'onConfirm'}
          onCancel={'onCancel'}
        />
      )} */}
    </article>
  );
};

export default Appointment;
