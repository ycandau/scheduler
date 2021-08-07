//------------------------------------------------------------------------------
// selectors.js
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
// Get all appointments for a given day

const getAppointmentsForDay = (state, day) => {
  const match = state.days.filter((d) => d.name === day)[0];
  const appointments = match ? match.appointments : [];
  return appointments.map((id) => state.appointments[id]);
};

//------------------------------------------------------------------------------
// Get all interviewers for a given day

const getInterviewersForDay = (state, day) => {
  const match = state.days.filter((d) => d.name === day)[0];
  const interviewers = match ? match.interviewers : [];
  return interviewers.map((id) => state.interviewers[id]);
};

//------------------------------------------------------------------------------
// Process interview object to populate interviewer from id

const getInterview = (state, interview) =>
  (interview && {
    ...interview,
    interviewer: state.interviewers[interview.interviewer],
  }) ||
  null;

export { getAppointmentsForDay, getInterviewersForDay, getInterview };
