//------------------------------------------------------------------------------
// Custom hook:  useApplicationData
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
// Import

import { useState, useEffect } from 'react';
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
  // State

  const [state, setState] = useState({
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
  // Helpers

  const updateAppointments = (state, id, interview) => {
    const appointment = {
      ...state.appointments[id],
      interview: interview ? { ...interview } : null,
    };

    return {
      ...state.appointments,
      [id]: appointment,
    };
  };

  const countSpots = (day, appointments) =>
    day.appointments.reduce((count, appt) => {
      return count + (appointments[appt].interview === null);
    }, 0);

  const updateDays = (state, appointments) => {
    const days = [...state.days];
    const index = getDayIndex(state, state.day);
    days[index].spots = countSpots(days[index], appointments);
    return days;
  };

  //----------------------------------------------------------------------------
  // CREATE: Book an interview

  const bookInterview = (id, interview) => {
    const appointments = updateAppointments(state, id, interview);
    const days = updateDays(state, appointments);
    return axios
      .put(`${URL}/api/appointments/${id}`, { interview })
      .then(() => setState((prev) => ({ ...prev, days, appointments })));
  };

  //----------------------------------------------------------------------------
  // DELETE: Cancel an interview

  const cancelInterview = (id) => {
    const appointments = updateAppointments(state, id, null);
    const days = updateDays(state, appointments);
    return axios
      .delete(`${URL}/api/appointments/${id}`)
      .then(() => setState((prev) => ({ ...prev, days, appointments })));
  };

  return { state, setDay, bookInterview, cancelInterview };
};

export default useApplicationData;
