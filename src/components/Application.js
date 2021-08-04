import React, { useState, useEffect } from 'react';
import axios from 'axios';

import 'components/Application.scss';

import DayList from './DayList';
import Appointment from './Appointment';

//------------------------------------------------------------------------------
// Constants

const HOST = 'http://localhost';
const PORT = 8001;
const URL = `${HOST}:${PORT}`;

//------------------------------------------------------------------------------
// Mock data

const appointments = [
  {
    id: 1,
    time: '12pm',
  },
  {
    id: 2,
    time: '1pm',
    interview: {
      student: 'Lydia Miller-Jones',
      interviewer: {
        id: 1,
        name: 'Sylvia Palmer',
        avatar: 'https://i.imgur.com/LpaY82x.png',
      },
    },
  },
  {
    id: 3,
    time: '2pm',
  },
  {
    id: 4,
    time: '3pm',
    interview: {
      student: 'Albert Alpert',
      interviewer: {
        id: 2,
        name: 'Norma Mornan',
        avatar: 'https://i.imgur.com/LpaY82x.png',
      },
    },
  },
  {
    id: 5,
    time: '4pm',
  },
];

//------------------------------------------------------------------------------
// Application

const Application = (props) => {
  const [state, setState] = useState({
    day: 'Monday',
    days: [],
    appointments: {},
  });

  const setDay = (day) => setState((prev) => ({ ...prev, day }));

  const setDays = (days) => setState((prev) => ({ ...prev, days }));

  useEffect(() => {
    axios
      .get(`${URL}/api/days`)
      .then((res) => setDays(res.data))
      .catch((err) => console.error(err));
  }, []); // Run only once

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
          <Appointment key={appointment.id} {...appointment} />
        ))}
        <Appointment key="last" time="5pm" />
      </section>
    </main>
  );
};

export default Application;
