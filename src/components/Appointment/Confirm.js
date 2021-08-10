import React from 'react';

import Button from '../Button';

//------------------------------------------------------------------------------

const Confirm = ({ message, onCancel, onConfirm }) => (
  <main className="appointment__card appointment__card--confirm">
    <h1 className="text--semi-bold">{message}</h1>
    <section className="appointment__actions">
      <Button onClick={onCancel} danger>
        Cancel
      </Button>
      <Button onClick={onConfirm} danger>
        Confirm
      </Button>
    </section>
  </main>
);

export default Confirm;
