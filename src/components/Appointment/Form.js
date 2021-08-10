import React, { useState } from 'react';

import Button from '../Button';
import InterviewerList from '../InterviewerList';

//------------------------------------------------------------------------------

const Form = ({ name, interviewerId, interviewers, onSave, onCancel }) => {
  const [error, setError] = useState('');
  const [nameLocal, setName] = useState(name || '');
  const [interviewerIdLocal, setInterviewerId] = useState(
    interviewerId || null
  );

  const reset = () => {
    setName('');
    setInterviewerId(null);
  };

  const cancel = () => {
    reset();
    onCancel();
  };

  const validate = () => {
    if (nameLocal === '') {
      return setError('Student name cannot be blank');
    }
    if (interviewerIdLocal === null) {
      return setError('An interviewer has to be chosen');
    }
    setError('');
    onSave(nameLocal, interviewerIdLocal);
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
            value={nameLocal}
            onChange={(event) => setName(event.target.value)}
            data-testid="student-name-input"
          />
        </form>
        <section className="appointment__validation">{error}</section>
        <InterviewerList
          interviewers={interviewers}
          value={interviewerIdLocal}
          onChange={setInterviewerId}
        />
      </section>
      <section className="appointment__card-right">
        <section className="appointment__actions">
          <Button onClick={cancel} danger>
            Cancel
          </Button>
          <Button onClick={validate} confirm>
            Save
          </Button>
        </section>
      </section>
    </main>
  );
};

export default Form;
