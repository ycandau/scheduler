import React from 'react';

import 'components/Button.scss';

const Button = function (props) {
  const buttonClass =
    'button' +
    (props.confirm ? ' button--confirm' : '') +
    (props.danger ? ' button--danger' : '');

  return (
    <button
      className={buttonClass}
      onClick={props.onClick}
      disabled={props.disabled}
    >
      {props.children}
    </button>
  );
};

export default Button;
