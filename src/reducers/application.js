//----------------------------------------------------------------------------
// Action types

const SET_DAY = 'SET_DAY';
const SET_INTERVIEW = 'SET_INTERVIEW';
const SET_APPLICATION_DATA = 'SET_APPLICATION_DATA';

//----------------------------------------------------------------------------
// Helper function

// Count the number of array elements matching a predicate
const count = (predicate) => (array) =>
  array.reduce((count, elem) => count + predicate(elem), 0);

//----------------------------------------------------------------------------
// Reducer

const reducer = (state, action) => {
  switch (action.type) {
    case SET_APPLICATION_DATA:
    case SET_DAY:
      return { ...state, ...action.data };

    // Immutable update to create, edit and delete interviews
    case SET_INTERVIEW:
      // Appointments
      const { id: apptId, interview } = action;
      const appointment = { ...state.appointments[apptId], interview };
      const appointments = { ...state.appointments, [apptId]: appointment };

      // Days
      const apptIsEmpty = (id) => appointments[id].interview === null;
      const countSpots = (day) => count(apptIsEmpty)(day.appointments);
      const dayIncludesAppt = (day) => day.appointments.includes(apptId);

      const days = state.days.map((day) =>
        dayIncludesAppt(day) ? { ...day, spots: countSpots(day) } : day
      );

      return { ...state, appointments, days };

    default:
      throw new Error(
        `Tried to reduce with unsupported action type: ${action.type}`
      );
  }
};

export { reducer as default, SET_DAY, SET_INTERVIEW, SET_APPLICATION_DATA };
