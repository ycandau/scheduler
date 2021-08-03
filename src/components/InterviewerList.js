import React from 'react';

import InterviewerListItem from './InterviewerListItem';

import 'components/InterviewerList.scss';

//------------------------------------------------------------------------------
// Props:
//   - interviewers: Array
//   - value: Number
//   - onChange(): Function

const InterviewerList = function (props) {
  const interviewerListItems = props.interviewers.map((interviewer) => (
    <InterviewerListItem
      key={interviewer.id}
      name={interviewer.name}
      avatar={interviewer.avatar}
      selected={interviewer.id === props.value}
      setInterviewer={(event) => props.onChange(interviewer.id)}
    />
  ));

  return (
    <section className="interviewers">
      <h4 className="interviewers__header text--light">Interviewer</h4>
      <ul className="interviewers__list">{interviewerListItems}</ul>
    </section>
  );
};

export default InterviewerList;