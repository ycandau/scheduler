import React, { useState } from 'react';

import 'components/Application.scss';

import DayList from './DayList';

//------------------------------------------------------------------------------
// Mock data

const days = [
  {
    id: 1,
    name: 'Monday',
    spots: 2,
  },
  {
    id: 2,
    name: 'Tuesday',
    spots: 5,
  },
  {
    id: 3,
    name: 'Wednesday',
    spots: 0,
  },
];

//------------------------------------------------------------------------------
// Application

const Application = function (props) {
  const [day, setDay] = useState('Monday');

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
          <DayList days={days} value={day} onChange={setDay} />
        </nav>

        {/* Bottom image */}
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />
      </section>
      <section className="schedule">
        {/* Replace this with the schedule elements durint the "The Scheduler" activity. */}
      </section>
    </main>
  );
};

export default Application;
