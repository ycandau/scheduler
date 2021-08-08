//------------------------------------------------------------------------------
// Custom hook:  useApplicationData
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
// Import

import { useReducer, useEffect } from 'react';
import axios from 'axios';

//------------------------------------------------------------------------------
// Constants

const HOST = 'http://localhost';
const PORT = 8001;
const URL = `${HOST}:${PORT}`;

//------------------------------------------------------------------------------
// Hook

const useApplicationData = () => {
  //----------------------------------------------------------------------------
  // Action types

  const SET_DAY = 'SET_DAY';
  const SET_INTERVIEW = 'SET_INTERVIEW';
  const SET_APPLICATION_DATA = 'SET_APPLICATION_DATA';

  //----------------------------------------------------------------------------
  // Helpers

  // Find an array element that matches a predicate
  const find = (predicate) => (array) => {
    for (let i = 0; i < array.length; i++) {
      if (predicate(array[i])) return [i, array[i]];
    }
    return [null, null];
  };

  // Predicate returns true if the day includes an appointment
  const dayIncludesAppt = (id) => (day) => day.appointments.includes(id);

  // Reducer to count the appointments that have null interviews
  const toCountSpots = (appointments) => (count, appt) =>
    count + (appointments[appt].interview === null);

  //----------------------------------------------------------------------------
  // Reducer

  const reducer = (state, action) => {
    switch (action.type) {
      case SET_APPLICATION_DATA:
      case SET_DAY:
        return { ...state, ...action.data };

      // Immutable update to create, edit and delete interviews
      case SET_INTERVIEW:
        const { id, interview } = action;
        const appointment = { ...state.appointments[id], interview };
        const appointments = { ...state.appointments, [id]: appointment };

        // Update spots
        const [index, day] = find(dayIncludesAppt(id))(state.days);
        const spots = day.appointments.reduce(toCountSpots(appointments), 0);
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
      axios.get(`${URL}/api/days`),
      axios.get(`${URL}/api/appointments`),
      axios.get(`${URL}/api/interviewers`),
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
      .put(`${URL}/api/appointments/${id}`, { interview })
      .then(() => dispatch({ type: SET_INTERVIEW, id, interview }));

  //----------------------------------------------------------------------------
  // DELETE: Cancel an interview

  const cancelInterview = (id) =>
    axios
      .delete(`${URL}/api/appointments/${id}`)
      .then(() => dispatch({ type: SET_INTERVIEW, id, interview: null }));

  return { state, setDay, bookInterview, cancelInterview };
};

export default useApplicationData;
