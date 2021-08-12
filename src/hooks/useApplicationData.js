import { useReducer, useEffect } from 'react';
import axios from 'axios';

import reducer, {
  SET_DAY,
  SET_INTERVIEW,
  SET_APPLICATION_DATA,
} from 'reducers/application';

//------------------------------------------------------------------------------

const useApplicationData = () => {
  //----------------------------------------------------------------------------
  // Websocket

  useEffect(() => {
    const ws = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);

    ws.onopen = () => ws.send('ping');

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === SET_INTERVIEW) {
        dispatch(message);
      }
    };

    // Close on cleanup
    return () => ws.close();
  }, []);

  //----------------------------------------------------------------------------
  // State

  const [state, dispatch] = useReducer(reducer, {
    day: 'Monday',
    days: [],
    appointments: {},
    interviewers: {},
  });

  // Fetch data once on initial render
  useEffect(() => {
    Promise.all([
      axios.get('/api/days'),
      axios.get('/api/appointments'),
      axios.get('/api/interviewers'),
    ])
      .then(
        ([{ data: days }, { data: appointments }, { data: interviewers }]) =>
          dispatch({
            type: SET_APPLICATION_DATA,
            data: { days, appointments, interviewers },
          })
      )
      .catch((err) => console.error(err));
  }, []);

  //----------------------------------------------------------------------------
  // Set the day

  const setDay = (day) => dispatch({ type: SET_DAY, data: { day } });

  //----------------------------------------------------------------------------
  // CREATE: Book an interview

  const bookInterview = (id, interview) =>
    axios
      .put(`/api/appointments/${id}`, { interview })
      .then(() => dispatch({ type: SET_INTERVIEW, id, interview }));

  //----------------------------------------------------------------------------
  // DELETE: Cancel an interview

  const cancelInterview = (id) =>
    axios
      .delete(`/api/appointments/${id}`)
      .then(() => dispatch({ type: SET_INTERVIEW, id, interview: null }));

  return { state, setDay, bookInterview, cancelInterview };
};

export default useApplicationData;
