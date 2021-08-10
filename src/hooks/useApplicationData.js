//------------------------------------------------------------------------------
// Custom hook: useApplicationData()
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
// Import

import { useReducer, useEffect } from 'react';
import axios from 'axios';

import { find, count } from '../helpers/util';

//------------------------------------------------------------------------------
// Hook

const useApplicationData = () => {
  //----------------------------------------------------------------------------
  // Action types

  const SET_DAY = 'SET_DAY';
  const SET_INTERVIEW = 'SET_INTERVIEW';
  const SET_APPLICATION_DATA = 'SET_APPLICATION_DATA';

  //----------------------------------------------------------------------------
  // Predicates

  // true if the day includes an appointment
  const dayIncludesAppt = (apptId) => (day) =>
    day.appointments.includes(apptId);

  // true if the appointment is empty (null)
  const apptIsEmpty = (appointments) => (apptId) =>
    appointments[apptId].interview === null;

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

        // Days (depends on appointments)
        const [index, day] = find(dayIncludesAppt(apptId))(state.days);
        const spots = count(apptIsEmpty(appointments))(day.appointments);
        const days = [...state.days];
        days[index] = { ...day, spots };

        return { ...state, appointments, days };

      default:
        throw new Error(
          `Tried to reduce with unsupported action type: ${action.type}`
        );
    }
  };

  //----------------------------------------------------------------------------
  // Websocket

  useEffect(() => {
    const ws = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);

    ws.onopen = () => ws.send('ping');

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === SET_INTERVIEW) dispatch(message);
    };

    // Close on cleanup
    return () => ws.close();
  }, []);

  //----------------------------------------------------------------------------
  // State

  const [state, dispatch] = useReducer(reducer, {
    day: 'Monday',
    days: [],
    appointments: {},
    interviewers: {},
  });

  // Fetch data once on initial render
  useEffect(() => {
    Promise.all([
      axios.get('/api/days'),
      axios.get('/api/appointments'),
      axios.get('/api/interviewers'),
    ])
      .then(
        ([{ data: days }, { data: appointments }, { data: interviewers }]) =>
          dispatch({
            type: SET_APPLICATION_DATA,
            data: { days, appointments, interviewers },
          })
      )
      .catch((err) => console.error(err));
  }, []);

  //----------------------------------------------------------------------------
  // Set the day

  const setDay = (day) => dispatch({ type: SET_DAY, data: { day } });

  //----------------------------------------------------------------------------
  // CREATE: Book an interview

  const bookInterview = (id, interview) =>
    axios
      .put(`/api/appointments/${id}`, { interview })
      .then(() => dispatch({ type: SET_INTERVIEW, id, interview }));

  //----------------------------------------------------------------------------
  // DELETE: Cancel an interview

  const cancelInterview = (id) =>
    axios
      .delete(`/api/appointments/${id}`)
      .then(() => dispatch({ type: SET_INTERVIEW, id, interview: null }));

  return { state, setDay, bookInterview, cancelInterview };
};

export default useApplicationData;
