import React from 'react';

//------------------------------------------------------------------------------
// Props:
//   -onAdd(): Function

const Empty = (props) => (
  <main className="appointment__add">
    <img
      className="appointment__add-button"
      src="images/add.png"
      alt="Add"
      onClick={props.onAdd}
    />
  </main>
);

export default Empty;
