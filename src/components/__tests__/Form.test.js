import React from 'react';

import { render, cleanup, fireEvent } from '@testing-library/react';

import Form from 'components/Appointment/Form';

//------------------------------------------------------------------------------

afterEach(cleanup);

describe('Form', () => {
  const interviewers = [
    {
      id: 1,
      name: 'Sylvia Palmer',
      avatar: 'https://i.imgur.com/LpaY82x.png',
    },
  ];

  //----------------------------------------------------------------------------

  it('renders without the student name if not provided', () => {
    const { getByTestId } = render(<Form interviewers={interviewers} />);
    expect(getByTestId('student-name-input')).toHaveValue('');
  });

  //----------------------------------------------------------------------------

  it('renders with the initial student name if provided', () => {
    const { getByTestId } = render(
      <Form interviewers={interviewers} name={'Lydia'} />
    );
    expect(getByTestId('student-name-input')).toHaveValue('Lydia');
  });

  //----------------------------------------------------------------------------

  it('validates that the student name is not blank', () => {
    const onSave = jest.fn();
    const { getByText } = render(
      <Form interviewerId={1} interviewers={interviewers} onSave={onSave} />
    );

    fireEvent.click(getByText('Save'));

    expect(getByText(/student name cannot be blank/i)).toBeInTheDocument();
    expect(onSave).not.toHaveBeenCalled();
  });

  //----------------------------------------------------------------------------

  it('validates that an interviewer is chosen', () => {
    const onSave = jest.fn();
    const { getByText } = render(
      <Form name={'Lydia'} interviewers={interviewers} onSave={onSave} />
    );

    fireEvent.click(getByText('Save'));

    expect(getByText(/an interviewer has to be chosen/i)).toBeInTheDocument();
    expect(onSave).not.toHaveBeenCalled();
  });

  //----------------------------------------------------------------------------

  it('successfully saves after trying to submit an empty student name', () => {
    const onSave = jest.fn();
    const { getByText, getByTestId, queryByText } = render(
      <Form interviewerId={1} interviewers={interviewers} onSave={onSave} />
    );
    const input = getByTestId('student-name-input');

    fireEvent.click(getByText('Save'));

    expect(getByText(/student name cannot be blank/i)).toBeInTheDocument();
    expect(onSave).not.toHaveBeenCalled();

    fireEvent.change(input, { target: { value: 'Lydia' } });
    fireEvent.click(getByText('Save'));

    expect(queryByText(/student name cannot be blank/i)).toBeNull();
    expect(onSave).toHaveBeenCalledTimes(1);
    expect(onSave).toHaveBeenCalledWith('Lydia', 1);
  });

  //----------------------------------------------------------------------------

  it('calls onCancel and resets the input field', () => {
    const onCancel = jest.fn();
    const { getByText, getByTestId, queryByText } = render(
      <Form
        interviewers={interviewers}
        name="Lydia"
        interviewerId={1}
        onSave={jest.fn()}
        onCancel={onCancel}
      />
    );
    const input = getByTestId('student-name-input');

    fireEvent.click(getByText('Save'));
    fireEvent.change(input, { target: { value: 'Lydia' } });
    fireEvent.click(getByText('Cancel'));

    expect(queryByText(/student name cannot be blank/i)).toBeNull();
    expect(input).toHaveValue('');
    expect(onCancel).toHaveBeenCalledTimes(1);
  });
});
