//------------------------------------------------------------------------------
// Application.js
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
// Import

import React, { useState, useEffect } from 'react';
import axios from 'axios';

import 'components/Application.scss';

import DayList from './DayList';
import Appointment from './Appointment';

import {
  getAppointmentsForDay,
  getInterviewersForDay,
  getInterview,
} from '../helpers/selectors';

//------------------------------------------------------------------------------
// Constants

const HOST = 'http://localhost';
const PORT = 8001;
const URL = `${HOST}:${PORT}`;

//------------------------------------------------------------------------------
// Application

const Application = (props) => {
  // Set state
  const [state, setState] = useState({
    day: 'Monday',
    days: [],
    appointments: {},
  });

  // Fetch data
  useEffect(() => {
    Promise.all([
      axios.get(`${URL}/api/days`),
      axios.get(`${URL}/api/appointments`),
      axios.get(`${URL}/api/interviewers`),
    ])
      .then(
        ([{ data: days }, { data: appointments }, { data: interviewers }]) => {
          console.log(days, appointments);
          setState((prev) => ({ ...prev, days, appointments, interviewers }));
        }
      )
      .catch((err) => console.error(err));
  }, []); // Run only once

  // Process data with selectors
  const interviewers = getInterviewersForDay(state, state.day);

  const appointments = getAppointmentsForDay(state, state.day).map(
    (appointment) => ({
      ...appointment,
      interview: getInterview(state, appointment.interview),
    })
  );

  // Define event handlers
  const setDay = (day) => setState((prev) => ({ ...prev, day }));

  // Book interview >> Appointment
  const bookInterview = (id, interview) => {
    console.log(id, interview);
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview },
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment,
    };
    setState((prev) => ({ ...prev, appointments }));
  };

  // Assemble component
  return (
    <main className="layout">
      <section className="sidebar">
        {/* Top image */}
        <img
          className="sidebar--centered"
          src="images/logo.png"
          alt="Interview Scheduler"
        />
        <hr className="sidebar__separator sidebar--centered" />

        {/* Day List */}
        <nav className="sidebar__menu">
          <DayList days={state.days} value={state.day} onChange={setDay} />
        </nav>

        {/* Bottom image */}
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />
      </section>

      {/* Schedule */}
      <section className="schedule">
        {appointments.map((appointment) => (
          <Appointment
            key={appointment.id}
            interviewers={interviewers}
            bookInterview={bookInterview}
            {...appointment}
          />
        ))}
        <Appointment key="last" time="5pm" />
      </section>
    </main>
  );
};

export default Application;
