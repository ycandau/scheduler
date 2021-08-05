import { useState } from 'react';

//------------------------------------------------------------------------------

const useVisualMode = (initial) => {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  const transition = (newMode, replace = false) => {
    setMode(() => newMode);
    setHistory((prev) => {
      const end = replace ? -1 : history.length;
      const newHistory = prev.slice(0, history.length - replace);
      newHistory.push(newMode);
      return newHistory;
    });
  };

  const back = () => {
    const decr = history.length > 1 ? 1 : 0;
    setMode(() => history[history.length - 1 - decr]);
    setHistory((prev) => prev.slice(0, history.length - decr));
  };

  return { mode, transition, back };
};

export default useVisualMode;
