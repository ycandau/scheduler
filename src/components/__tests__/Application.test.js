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
      getByAltText(appt, 'Add')
    );

    fireEvent.click(getByAltText(appointment, 'Add'));

    const input = getByTestId(appointment, 'student-name-input');
    fireEvent.change(input, { target: { value: 'Lydia' } });
    fireEvent.click(getByAltText(appointment, 'Sylvia Palmer'));
    fireEvent.click(getByText(appointment, 'Save'));

    expect(getByText(appointment, 'Saving')).toBeInTheDocument();

    await waitForElement(() => getByText(appointment, 'Lydia'));

    const days = getAllByTestId(container, 'day');
    const day = days.find((d) => queryByText(d, 'Monday'));

    expect(getByText(day, 'no spots remaining')).toBeInTheDocument();
  });

  //----------------------------------------------------------------------------

  it(`loads data, cancels an interview and increases the spots remaining for
      Monday by 1`, async () => {
    const { container } = render(<Application />);

    await waitForElement(() => getByText(container, 'Archie Cohen'));

    const appointment = getAllByTestId(container, 'appointment').find((appt) =>
      queryByText(appt, 'Archie Cohen')
    );
    fireEvent.click(getByAltText(appointment, 'Delete'));

    expect(
      getByText(appointment, 'Delete the appointment?')
    ).toBeInTheDocument();

    fireEvent.click(getByText(appointment, 'Confirm'));

    expect(getByText(appointment, 'Deleting')).toBeInTheDocument();

    await waitForElement(() => getByAltText(appointment, 'Add'));
    const days = getAllByTestId(container, 'day');
    const day = days.find((d) => queryByText(d, 'Monday'));

    expect(getByText(day, '2 spots remaining')).toBeInTheDocument();
  });

  //----------------------------------------------------------------------------

  it(`loads data, edits an interview and keeps the spots remaining for Monday
      the same`, async () => {
    const { container } = render(<Application />);

    await waitForElement(() => getByText(container, 'Archie Cohen'));

    const appointment = getAllByTestId(container, 'appointment').find((appt) =>
      queryByText(appt, 'Archie Cohen')
    );
    fireEvent.click(getByAltText(appointment, 'Edit'));

    const input = getByDisplayValue(appointment, 'Archie Cohen');
    fireEvent.change(input, { target: { value: 'Lydia' } });
    fireEvent.click(getByText(appointment, 'Save'));

    expect(getByText(appointment, 'Saving')).toBeInTheDocument();

    await waitForElement(() => getByText(appointment, 'Lydia'));
    const days = getAllByTestId(container, 'day');
    const day = days.find((d) => queryByText(d, 'Monday'));

    expect(getByText(day, '1 spot remaining')).toBeInTheDocument();
  });

  //----------------------------------------------------------------------------

  it('shows the save error when failing to save an appointment', async () => {
    const { container } = render(<Application />);

    await waitForElement(() => getByText(container, 'Archie Cohen'));

    const appointment = getAllByTestId(container, 'appointment').find((appt) =>
      queryByText(appt, 'Archie Cohen')
    );
    fireEvent.click(getByAltText(appointment, 'Edit'));

    const input = getByDisplayValue(appointment, 'Archie Cohen');
    fireEvent.change(input, { target: { value: 'Lydia' } });

    axios.put.mockRejectedValueOnce();
    fireEvent.click(getByText(appointment, 'Save'));

    expect(getByText(appointment, 'Saving')).toBeInTheDocument();

    await waitForElement(() =>
      getByText(appointment, 'Could not book the appointment.')
    );

    fireEvent.click(getByAltText(appointment, 'Close'));

    expect(getByText(appointment, 'Archie Cohen')).toBeInTheDocument();

    const days = getAllByTestId(container, 'day');
    const day = days.find((d) => queryByText(d, 'Monday'));

    expect(getByText(day, '1 spot remaining')).toBeInTheDocument();
  });

  //----------------------------------------------------------------------------

  it(`shows the delete error when failing to delete an existing
      appointment`, async () => {
    const { container } = render(<Application />);

    await waitForElement(() => getByText(container, 'Archie Cohen'));

    const appointment = getAllByTestId(container, 'appointment').find((appt) =>
      queryByText(appt, 'Archie Cohen')
    );
    fireEvent.click(getByAltText(appointment, 'Delete'));

    expect(
      getByText(appointment, 'Delete the appointment?')
    ).toBeInTheDocument();

    axios.delete.mockRejectedValueOnce();
    fireEvent.click(getByText(appointment, 'Confirm'));

    expect(getByText(appointment, 'Deleting')).toBeInTheDocument();

    await waitForElement(() =>
      getByText(appointment, 'Could not cancel the appointment.')
    );

    fireEvent.click(getByAltText(appointment, 'Close'));

    expect(getByText(appointment, 'Archie Cohen')).toBeInTheDocument();

    const days = getAllByTestId(container, 'day');
    const day = days.find((d) => queryByText(d, 'Monday'));

    expect(getByText(day, '1 spot remaining')).toBeInTheDocument();
  });
});
