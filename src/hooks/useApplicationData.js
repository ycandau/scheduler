//------------------------------------------------------------------------------
// Custom hook:  useApplicationData
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
// Import

import { useReducer, useEffect } from 'react';
import axios from 'axios';

import { getDayIndex } from '../helpers/selectors';

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

  const getDay = (days, dayName) => {
    for (let i = 0; i < days.length; i++) {
      if (days[i].name === dayName) return [i, days[i]];
    }
    return [null, null];
  };

  const countSpots = (day, appointments) =>
    day.appointments.reduce((count, appt) => {
      return count + (appointments[appt].interview === null);
    }, 0);

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
        const [index, day] = getDay(state.days, state.day);
        const spots = countSpots(day, appointments);
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
