import React, { useState } from 'react';

import Button from '../Button';
import InterviewerList from '../InterviewerList';

//------------------------------------------------------------------------------
// Props | Created:
//   - interviewers: Array
//   - onSave(): Function
//   - onCancel(): Function
//
// Props | Edit:
//   - name: String
//   - interviewers: Array
//   - interviewerId: Number
//   - onSave(): Function
//   - onCancel(): Function
//
// State:
//   - name: String
//   - interviewerId: Number
//
// Actions:
//   - setName(): Function
//   - setInterviewer(): Function

const Form = (props) => {
  const [name, setName] = useState(props.name || '');
  const [interviewerId, setInterviewerId] = useState(
    props.interviewerId || null
  );

  const reset = () => {
    setName('');
    setInterviewerId(null);
  };

  const cancel = () => {
    reset();
    props.onCancel();
  };

  const save = () => {
    props.onSave(name, interviewerId);
  };

  return (
    <main className="appointment__card appointment__card--create">
      <section className="appointment__card-left">
        <form autoComplete="off" onSubmit={(event) => event.preventDefault()}>
          <input
            className="appointment__create-input text--semi-bold"
            name="name"
            type="text"
            placeholder="Enter Student Name"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </form>
        <InterviewerList
          interviewers={props.interviewers}
          value={interviewerId}
          onChange={setInterviewerId}
        />
      </section>
      <section className="appointment__card-right">
        <section className="appointment__actions">
          <Button onClick={cancel} danger>
            Cancel
          </Button>
          <Button onClick={save} confirm>
            Save
          </Button>
        </section>
      </section>
    </main>
  );
};

export default Form;
