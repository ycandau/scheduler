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
//   - time: String
//   - interview: Object
//   - interviewers

const Appointment = (props) => {
  const CONFIRM = 'CONFIRM';
  const EMPTY = 'EMPTY';
  const ERROR = 'ERROR';
  const CREATE = 'CREATE';
  const EDIT = 'EDIT';
  const SHOW = 'SHOW';
  const SAVING = 'SAVING';
  const DELETING = 'DELETE';

  // Custom hook
  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  // State transitions
  const onAdd = () => transition(CREATE);
  const onCancel = () => back();

  // Assemble component
  return (
    <article className="appointment">
      <Header time={props.time} />
      {mode === EMPTY && <Empty onAdd={onAdd} />}
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
          onSave={'onSave'}
          onCancel={onCancel}
        />
      )}
      {/* {mode === EDIT && (
        <Form
          name="Lydia Miller-Jones"
          interviewers={props.interview.interviewer}
          interviewer={2}
          onSave={'onSave'}
          onCancel={'onCancel'}
        />
      )}
      {mode === DELETING && <Status message="Deleting" />}
      {mode === CONFIRM && (
        <Confirm
          message="Delete the appointment?"
          onConfirm={'onConfirm'}
          onCancel={'onCancel'}
        />
      )}
      {mode === SAVING && <Status message="Deleting" />} */}
    </article>
  );
};

export default Appointment;
