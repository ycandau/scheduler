//------------------------------------------------------------------------------
// selectors.js
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
// Get the index of a day in the days array based on its name

const getDayIndex = (state, dayName) => {
  for (let i = 0; i < state.days.length; i++) {
    if (state.days[i].name === dayName) return i;
  }
  return null;
};

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

export {
  getDayIndex,
  getAppointmentsForDay,
  getInterviewersForDay,
  getInterview,
};
