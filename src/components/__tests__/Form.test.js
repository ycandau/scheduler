import React from 'react';

import { render, cleanup, fireEvent } from '@testing-library/react';

import Form from 'components/Appointment/Form';

//------------------------------------------------------------------------------
// General

afterEach(cleanup);

describe('Form', () => {
  const interviewers = [
    {
      id: 1,
      name: 'Sylvia Palmer',
      avatar: 'https://i.imgur.com/LpaY82x.png',
    },
  ];

  it('renders without crashing', () => {
    render(<Form interviewers={interviewers} />);
  });

  it('renders without the student name if not provided', () => {
    const { getByTestId } = render(<Form interviewers={interviewers} />);
    expect(getByTestId('student-name-input')).toHaveValue('');
  });

  it('renders with the initial student name if provided', () => {
    const { getByTestId } = render(
      <Form interviewers={interviewers} name={'Lydia'} />
    );
    expect(getByTestId('student-name-input')).toHaveValue('Lydia');
  });

  //----------------------------------------------------------------------------
  // Form validation

  it('validates that the student name is not blank', () => {
    const onSave = jest.fn();
    const { getByText } = render(
      <Form interviewerId={1} interviewers={interviewers} onSave={onSave} />
    );

    fireEvent.click(getByText('Save'));

    expect(getByText(/student name cannot be blank/i)).toBeInTheDocument();
    expect(onSave).not.toHaveBeenCalled();
  });

  it('validates that an interviewer is chosen', () => {
    const onSave = jest.fn();
    const { getByText } = render(
      <Form name={'Lydia'} interviewers={interviewers} onSave={onSave} />
    );

    fireEvent.click(getByText('Save'));

    expect(getByText(/an interviewer has to be chosen/i)).toBeInTheDocument();
    expect(onSave).not.toHaveBeenCalled();
  });

  it('calls onSave() when the interviewer id is defined', () => {
    const onSave = jest.fn();
    const { getByText, queryByText } = render(
      <Form
        name={'Lydia'}
        interviewerId={1}
        interviewers={interviewers}
        onSave={onSave}
      />
    );

    fireEvent.click(getByText('Save'));

    expect(queryByText(/An interviewer has to be chosen/i)).toBeNull();
    expect(onSave).toHaveBeenCalledTimes(1);
    expect(onSave).toHaveBeenCalledWith('Lydia', 1);
  });
});
