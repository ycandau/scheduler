//------------------------------------------------------------------------------
// Custom hook:  useApplicationData
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
// Import

import { useState, useEffect } from 'react';
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
  // State

  const [state, setState] = useState({
    day: 'Monday',
    days: [],
    appointments: {},
  });

  // Fetch data once on initial render
  useEffect(() => {
    Promise.all([
      axios.get(`${URL}/api/days`),
      axios.get(`${URL}/api/appointments`),
      axios.get(`${URL}/api/interviewers`),
    ])
      .then(
        ([{ data: days }, { data: appointments }, { data: interviewers }]) => {
          setState((prev) => ({ ...prev, days, appointments, interviewers }));
        }
      )
      .catch((err) => console.error(err));
  }, []);

  //----------------------------------------------------------------------------
  // Set the day

  const setDay = (day) => setState((prev) => ({ ...prev, day }));

  //----------------------------------------------------------------------------
  // CREATE: Book an interview

  const bookInterview = (id, interview) => {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview },
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment,
    };

    // Return promise so function is thenable
    return axios
      .put(`${URL}/api/appointments/${id}`, { interview })
      .then(() => setState((prev) => ({ ...prev, appointments })));
  };

  //----------------------------------------------------------------------------
  // DELETE: Cancel an interview

  const cancelInterview = (id) => {
    const appointment = {
      ...state.appointments[id],
      interview: null,
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment,
    };

    // Return promise so function is thenable
    return axios
      .delete(`${URL}/api/appointments/${id}`)
      .then(() => setState((prev) => ({ ...prev, appointments })));
  };

  return { state, setDay, bookInterview, cancelInterview };
};

export default useApplicationData;
