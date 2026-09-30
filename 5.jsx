import React, { useState, useEffect } from 'react';

export default function Stopwatch() {
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  const handleReset = () => {
    setIsActive(false);
    setSeconds(0);
  };

  return (
    <div>
      <h2>Stopwatch: {seconds}s</h2>
      <button onClick={() => setIsActive(true)} disabled={isActive}>
        Start
      </button>
      <button onClick={() => setIsActive(false)} disabled={!isActive}>
        Pause
      </button>
      <button onClick={handleReset}>Reset</button>
    </div>
  );
}