import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import './Stopwatch.css';

const Stopwatch = forwardRef(({ lane, onClose }, ref) => {
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef(null);
  const [log, setLog] = useState([]);
  const [showLog, setShowLog] = useState(false);

  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  const start = () => {
    if (!running) {
      intervalRef.current = setInterval(() => {
        setTime((prevTime) => prevTime + 10);
      }, 10);
      setRunning(true);
      setLog(prevLog => [...prevLog, { type: 'start', timestamp: new Date() }]);
    }
  };

  const stop = () => {
    clearInterval(intervalRef.current);
    setRunning(false);
    setLog(prevLog => [...prevLog, { type: 'stop', timestamp: new Date(), timeAtStop: time }]);
  };

  const reset = () => {
    clearInterval(intervalRef.current);
    setTime(0);
    setRunning(false);
    setLog(prevLog => [...prevLog, { type: 'reset', timestamp: new Date() }]);
  };

  useImperativeHandle(ref, () => ({
    start,
    stop,
    reset
  }), [running, time]);

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
        {!running && <button onClick={start}>Start</button>}
        {running && <button onClick={stop}>Stop</button>}
        <button onClick={reset}>Reset</button>
        <button onClick={onClose}>Close</button>
        <button onClick={() => setShowLog(!showLog)}>{showLog ? 'Hide Log' : 'Show Log'}</button>
      </div>
      {showLog && (
        <div className="log-display">
          <h3>Event Log</h3>
          {log.map((entry, index) => (
            <div key={index} className="log-entry">
              {entry.type === 'stop'
                ? `${entry.type.charAt(0).toUpperCase() + entry.type.slice(1)} at ${formatTime(entry.timeAtStop)}s - ${new Date(entry.timestamp).toLocaleTimeString()}`
                : `${entry.type.charAt(0).toUpperCase() + entry.type.slice(1)} - ${new Date(entry.timestamp).toLocaleTimeString()}`}
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

export default Stopwatch;
