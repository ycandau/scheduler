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
  // Manage state
  const [state, setState] = useState({
    day: 'Monday',
    days: [],
    appointments: {},
  });

  const setDay = (day) => setState((prev) => ({ ...prev, day }));

  // Side effects
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
  const appointments = getAppointmentsForDay(state, state.day).map(
    (appointment) => ({
      ...appointment,
      interview: getInterview(state, appointment.interview),
    })
  );
  const interviewers = getInterviewersForDay(state, state.day);

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
            {...appointment}
          />
        ))}
        <Appointment key="last" time="5pm" />
      </section>
    </main>
  );
};

export default Application;
