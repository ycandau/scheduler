import { useState } from 'react';

//------------------------------------------------------------------------------

const useVisualMode = (initial) => {
  const [history, setHistory] = useState([initial]);

  const transition = (mode, replace = false) => {
    setHistory((prev) => {
      const newHistory = prev.slice(0, prev.length - replace);
      newHistory.push(mode);
      return newHistory;
    });
  };

  const back = () => {
    setHistory((prev) => prev.slice(0, Math.max(prev.length - 1, 1)));
  };

  return { mode: history[history.length - 1], transition, back };
};

export default useVisualMode;
