//------------------------------------------------------------------------------
// selectors.js
//------------------------------------------------------------------------------

const getAppointmentsForDay = (state, day) => {
  const match = state.days.filter((d) => d.name === day)[0];
  const appointments = (match && match.appointments) || [];
  return appointments.map((id) => state.appointments[id]);
};

const getInterview = (state, interview) =>
  (interview && {
    ...interview,
    interviewer: state.interviewers[interview.interviewer],
  }) ||
  null;

export { getAppointmentsForDay, getInterview };