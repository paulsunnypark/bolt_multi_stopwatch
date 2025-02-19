import React, { useState, useEffect, useRef } from 'react';
import './Stopwatch.css';

function Stopwatch({ lane, onClose }) { // onClose prop 추가
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  const handleStart = () => {
    if (!running) {
      intervalRef.current = setInterval(() => {
        setTime((prevTime) => prevTime + 10);
      }, 10);
      setRunning(true);
    }
  };

  const handleStop = () => {
    clearInterval(intervalRef.current);
    setRunning(false);
  };

  const handleReset = () => {
    clearInterval(intervalRef.current);
    setTime(0);
    setRunning(false);
  };

  const formatTime = (milliseconds) => {
    const seconds = Math.floor(milliseconds / 100);
    const hundredths = milliseconds % 100;
    return `${seconds}.${hundredths.toString().padStart(2, '0')}`;
  };

  return (
    <div className="Stopwatch">
      <div className="lane-label">Lane {lane}</div>
      <div className="time">{formatTime(time)}</div>
      <div className="controls">
        {!running && <button onClick={handleStart}>Start</button>}
        {running && <button onClick={handleStop}>Stop</button>}
        <button onClick={handleReset}>Reset</button>
        <button onClick={onClose}>Close</button> {/* Close 버튼 추가 */}
      </div>
    </div>
  );
}

export default Stopwatch;
