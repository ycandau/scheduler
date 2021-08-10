import React from 'react';

import {
  render,
  cleanup,
  getByText,
  getByTestId,
  getByAltText,
  getByDisplayValue,
  getAllByTestId,
  queryByText,
  waitForElement,
  fireEvent,
} from '@testing-library/react';

import Application from 'components/Application';

import axios from 'axios';

//------------------------------------------------------------------------------

afterEach(cleanup);

describe('Application', () => {
  it('changes the schedule when a new day is selected', async () => {
    const { container } = render(<Application />);

    await waitForElement(() => getByText(container, 'Monday'));
    fireEvent.click(getByText(container, 'Tuesday'));
    expect(getByText(container, 'Leopold Silvers')).toBeInTheDocument();
  });

  //----------------------------------------------------------------------------

  it(`loads data, books an interview, and reduces the spots remaining for
      Monday by 1`, async () => {
    const { container } = render(<Application />);

    await waitForElement(() => getByText(container, 'Archie Cohen'));

    const appointment = getAllByTestId(container, 'appointment').find((appt) =>
      getByAltText(appt, /add/i)
    );

    fireEvent.click(getByAltText(appointment, /add/i));

    const input = getByTestId(appointment, 'student-name-input');
    fireEvent.change(input, { target: { value: 'Lydia' } });
    fireEvent.click(getByAltText(appointment, 'Sylvia Palmer'));
    fireEvent.click(getByText(appointment, /save/i));

    expect(getByText(appointment, /saving/i)).toBeInTheDocument();

    await waitForElement(() => getByText(appointment, 'Lydia'));

    const days = getAllByTestId(container, 'day');
    const day = days.find((d) => queryByText(d, 'Monday'));

    expect(getByText(day, /no spots remaining/i)).toBeInTheDocument();
  });

  //----------------------------------------------------------------------------

  it(`loads data, cancels an interview and increases the spots remaining for
      Monday by 1`, async () => {
    const { container } = render(<Application />);

    await waitForElement(() => getByText(container, 'Archie Cohen'));

    const appointment = getAllByTestId(container, 'appointment').find((appt) =>
      queryByText(appt, 'Archie Cohen')
    );
    fireEvent.click(getByAltText(appointment, /delete/i));

    expect(
      getByText(appointment, /delete the appointment/i)
    ).toBeInTheDocument();

    fireEvent.click(getByText(appointment, /confirm/i));

    expect(getByText(appointment, /deleting/i)).toBeInTheDocument();

    await waitForElement(() => getByAltText(appointment, /add/i));
    const days = getAllByTestId(container, 'day');
    const day = days.find((d) => queryByText(d, 'Monday'));

    expect(getByText(day, /2 spots remaining/i)).toBeInTheDocument();
  });

  //----------------------------------------------------------------------------

  it(`loads data, edits an interview and keeps the spots remaining for Monday
      the same`, async () => {
    const { container } = render(<Application />);

    await waitForElement(() => getByText(container, 'Archie Cohen'));

    const appointment = getAllByTestId(container, 'appointment').find((appt) =>
      queryByText(appt, 'Archie Cohen')
    );
    fireEvent.click(getByAltText(appointment, /edit/i));

    const input = getByDisplayValue(appointment, 'Archie Cohen');
    fireEvent.change(input, { target: { value: 'Lydia' } });
    fireEvent.click(getByText(appointment, /save/i));

    expect(getByText(appointment, /saving/i)).toBeInTheDocument();

    await waitForElement(() => getByText(appointment, 'Lydia'));
    const days = getAllByTestId(container, 'day');
    const day = days.find((d) => queryByText(d, 'Monday'));

    expect(getByText(day, /1 spot remaining/i)).toBeInTheDocument();
  });

  //----------------------------------------------------------------------------

  it('shows the save error when failing to save an appointment', async () => {
    const { container } = render(<Application />);

    await waitForElement(() => getByText(container, 'Archie Cohen'));

    const appointment = getAllByTestId(container, 'appointment').find((appt) =>
      queryByText(appt, 'Archie Cohen')
    );
    fireEvent.click(getByAltText(appointment, /edit/i));

    const input = getByDisplayValue(appointment, 'Archie Cohen');
    fireEvent.change(input, { target: { value: 'Lydia' } });

    axios.put.mockRejectedValueOnce();
    fireEvent.click(getByText(appointment, /save/i));

    expect(getByText(appointment, /saving/i)).toBeInTheDocument();

    await waitForElement(() =>
      getByText(appointment, /could not book the appointment/i)
    );

    fireEvent.click(getByAltText(appointment, /close/i));

    expect(getByText(appointment, 'Archie Cohen')).toBeInTheDocument();

    const days = getAllByTestId(container, 'day');
    const day = days.find((d) => queryByText(d, 'Monday'));

    expect(getByText(day, /1 spot remaining/i)).toBeInTheDocument();
  });

  //----------------------------------------------------------------------------

  it(`shows the delete error when failing to delete an existing
      appointment`, async () => {
    const { container } = render(<Application />);

    await waitForElement(() => getByText(container, 'Archie Cohen'));

    const appointment = getAllByTestId(container, 'appointment').find((appt) =>
      queryByText(appt, 'Archie Cohen')
    );
    fireEvent.click(getByAltText(appointment, /delete/i));

    expect(
      getByText(appointment, /delete the appointment/i)
    ).toBeInTheDocument();

    axios.delete.mockRejectedValueOnce();
    fireEvent.click(getByText(appointment, /confirm/i));

    expect(getByText(appointment, /deleting/i)).toBeInTheDocument();

    await waitForElement(() =>
      getByText(appointment, /could not cancel the appointment/i)
    );

    fireEvent.click(getByAltText(appointment, /close/i));

    expect(getByText(appointment, 'Archie Cohen')).toBeInTheDocument();

    const days = getAllByTestId(container, 'day');
    const day = days.find((d) => queryByText(d, 'Monday'));

    expect(getByText(day, /1 spot remaining/i)).toBeInTheDocument();
  });
});
