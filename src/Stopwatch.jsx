import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import './Stopwatch.css';

const Stopwatch = forwardRef(({ lane, onClose }, ref) => {
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef(null);
  const [log, setLog] = useState([]);
  const [showLog, setShowLog] = useState(false);
  const [lapNumber, setLapNumber] = useState(1);

  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  const start = () => {
    if (!running) {
      if (time === 0) { // True start
        setLapNumber(1);
        setLog(prevLog => [...prevLog, { type: 'start', timestamp: new Date() }]);
      }
      // For resume, no new 'start' log, no lapNumber change.
      // The 'resume' event could be logged here if needed:
      // else {
      //   setLog(prevLog => [...prevLog, { type: 'resume', timestamp: new Date() }]);
      // }
      intervalRef.current = setInterval(() => {
        setTime((prevTime) => prevTime + 10);
      }, 10);
      setRunning(true);
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
    setLapNumber(1); // Reset lap number on reset
    setLog([]); // Clear the log for the lane
  };

  const lap = () => {
    setLog(prevLog => [...prevLog, { type: 'lap', lapNumber: lapNumber, timestamp: new Date(), timeAtLap: time }]);
    setLapNumber(prevLapNumber => prevLapNumber + 1);
  };

  const clearRecords = () => {
    setLog([]);
    setLapNumber(1);
  };

  const isRunningState = () => {
    return running;
  };

  useImperativeHandle(ref, () => ({
    start,
    stop,
    reset,
    lap,
    clearRecords,
    isRunningState
  }), [running, time, log, lapNumber]);

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
        {running && <button onClick={lap}>Lap</button>}
        <button onClick={onClose}>Close</button>
        <button onClick={() => setShowLog(!showLog)}>{showLog ? 'Hide Records' : 'Show Records'}</button>
      </div>
      {showLog && (
        <div className="log-display">
          <h3>Event Records</h3>
          {log.map((entry, index) => {
            let content = '';
            if (entry.type === 'start') {
              content = `Started - ${new Date(entry.timestamp).toLocaleTimeString()}`;
            } else if (entry.type === 'lap') {
              content = `Lap ${entry.lapNumber}: ${formatTime(entry.timeAtLap)}s - (Timestamp: ${new Date(entry.timestamp).toLocaleTimeString()})`;
            } else if (entry.type === 'stop') {
              content = `Stopped at ${formatTime(entry.timeAtStop)}s - (Timestamp: ${new Date(entry.timestamp).toLocaleTimeString()})`;
            } else {
              // Fallback for any other unknown log types
              content = `${entry.type.charAt(0).toUpperCase() + entry.type.slice(1)} - ${new Date(entry.timestamp).toLocaleTimeString()}`;
            }
            return <div key={index} className="log-entry">{content}</div>;
          })}
        </div>
      )}
    </div>
  );
});

export default Stopwatch;
