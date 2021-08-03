import React, { useState } from 'react';

import Button from '../Button';
import InterviewerList from '../InterviewerList';

//------------------------------------------------------------------------------
// Props:
//   - name: String
//   - interviewers: Array
//   - interviewer: Number
//   - onSave(): Function
//   - onCancel(): Function
//
// State:
//   - name: String
//   - interviewer: Number
//
// Actions:
//   - setName(): Function
//   - setInterviewer(): Function

const Form = function (props) {
  return (
    <main className="appointment__card appointment__card--create">
      <section className="appointment__card-left">
        <form autoComplete="off">
          <input
            className="appointment__create-input text--semi-bold"
            name="name"
            type="text"
            placeholder="Enter Student Name"
            value={props.name}
            /*
          This must be a controlled component
        */
          />
        </form>
        <InterviewerList
          interviewers={props.interviewers}
          value={props.interviewer}
          onChange={null}
        />
      </section>
      <section className="appointment__card-right">
        <section className="appointment__actions">
          <Button onClick={props.onCancel} danger>
            Cancel
          </Button>
          <Button onClick={props.onSave} confirm>
            Save
          </Button>
        </section>
      </section>
    </main>
  );
};

export default Form;
