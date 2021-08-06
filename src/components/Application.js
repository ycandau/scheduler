//------------------------------------------------------------------------------
// Application.js
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
// Import

// Packages
import React from 'react';

// Styles
import 'components/Application.scss';

// Components
import DayList from './DayList';
import Appointment from './Appointment';

// Hooks
import useApplicationData from '../hooks/useApplicationData';

// Selectors
import {
  getInterview,
  getInterviewersForDay,
  getAppointmentsForDay,
} from '../helpers/selectors';

//------------------------------------------------------------------------------
// Application

const Application = (props) => {
  //----------------------------------------------------------------------------
  // Use a hook to manage the app state

  const { state, setDay, bookInterview, cancelInterview } =
    useApplicationData();

  //----------------------------------------------------------------------------
  // Process the data with selectors

  const interviewers = getInterviewersForDay(state, state.day);

  const appointments = getAppointmentsForDay(state, state.day).map(
    (appointment) => (
      <Appointment
        key={appointment.id}
        {...appointment}
        interview={getInterview(state, appointment.interview)}
        interviewers={interviewers}
        bookInterview={bookInterview}
        cancelInterview={cancelInterview}
      />
    )
  );

  //----------------------------------------------------------------------------
  // Assemble the component

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
        {appointments}
        <Appointment key="last" time="5pm" />
      </section>
    </main>
  );
};

export default Application;
