import React from 'react';

import InterviewerListItem from './InterviewerListItem';

import 'components/InterviewerList.scss';

//------------------------------------------------------------------------------
// Props:
//   - interviewers: Array
//   - interviewer: String
//   - setInterviewer: Function

const InterviewerList = function (props) {
  const interviewerListItems = props.interviewers.map((int) => (
    <InterviewerListItem
      id={int.id}
      name={int.name}
      avatar={int.avatar}
      selected={props.interviewer === int.id}
      setInterviewer={props.setInterviewer}
    ></InterviewerListItem>
  ));

  return (
    <section className="interviewers">
      <h4 className="interviewers__header text--light">Interviewer</h4>
      <ul className="interviewers__list">{interviewerListItems}</ul>
    </section>
  );
};

export default InterviewerList;
