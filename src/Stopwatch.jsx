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

  // 시간만 0으로 초기화, 기록은 유지
  const resetTimeOnly = () => {
    setTime(0);
    setRunning(false);
  };

  // 기록을 지정 포맷으로 반환
  // Lap 기록이 항상 이전 Lap/Start/Stop과 이어지도록, Stopped는 마지막 Lap과 이어지도록
  const getFormattedRecords = () => {
    if (log.length === 0) return 'No records.';
    let result = '';
    let prevLabel = 'Started';
    let prevTime = 0;
    let prevLap = 1;
    let stopTime = 0;
    let started = false;
    let lapIdx = 1;
    let firstLapTime = null;
    log.forEach((entry, idx) => {
      if (entry.type === 'start') {
        started = true;
        prevLabel = 'Started';
        prevTime = 0;
        prevLap = 1;
        lapIdx = 1;
        firstLapTime = null;
      } else if (entry.type === 'lap') {
        if (firstLapTime === null) {
          // 첫 Lap이면 Started - Lap 1
          result += `Started - Lap 1: ${(entry.timeAtLap / 1000).toFixed(2)}초\n`;
          firstLapTime = entry.timeAtLap;
        } else {
          lapIdx++;
          result += `Lap ${prevLap} - Lap ${lapIdx} : ${((entry.timeAtLap - prevTime) / 1000).toFixed(2)}초\n`;
          prevLap = lapIdx;
        }
        prevLabel = `Lap ${prevLap}`;
        prevTime = entry.timeAtLap;
      } else if (entry.type === 'stop') {
        stopTime = entry.timeAtStop;
        result += `${prevLabel} - Stopped : ${((entry.timeAtStop - prevTime) / 1000).toFixed(2)} 초\n`;
        prevLabel = 'Stopped';
        prevTime = entry.timeAtStop;
      }
    });
    if (started && stopTime > 0) {
      result += `(Started - Stopped : 총 ${(stopTime / 1000).toFixed(2)} 초)`;
    }
    return result.trim();
  };

  const isRunningState = () => {
    return running;
  };

  // Lap All, Lap 버튼 모두 Started - Lap 1이 반드시 기록되도록
  const ensureStarted = () => {
    if (log.length === 0 || log[0].type !== 'start') {
      setLog(prevLog => [...prevLog, { type: 'start', timestamp: new Date() }]);
      setLapNumber(1);
    }
  };

  useImperativeHandle(ref, () => ({
    start,
    stop,
    reset,
    lap,
    clearRecords,
    isRunningState,
    resetTimeOnly,
    getFormattedRecords,
    ensureStarted
  }), [running, time, log, lapNumber]);

  // 시간 포맷: 12.34 = 12초 34/100초
  const formatTime = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hundredths = Math.floor((milliseconds % 1000) / 10);
    return `${totalSeconds}.${hundredths.toString().padStart(2, '0')}`;
  };

  return (
    <div className="Stopwatch">
      <div className="lane-label">Lane {lane}</div>
      <div className="time">{formatTime(time)}</div>
      <div className="controls">
        {!running && <button className="start-btn" onClick={start}>Start</button>}
        {running && <button className="stop-btn" onClick={stop}>Stop</button>}
        {running && <button onClick={() => { ensureStarted(); lap(); }}>
          {log.filter(e => e.type === 'lap').length === 0 ? 'Lap 1' : `Lap ${log.filter(e => e.type === 'lap').length + 1}`}
        </button>}
        <button onClick={onClose}>Close</button>
        <button onClick={() => setShowLog(!showLog)}>{showLog ? 'Hide Records' : 'Show Records'}</button>
      </div>
      {showLog && (
        <div className="log-display">
          <h3>Event Records</h3>
          <pre>{getFormattedRecords()}</pre>
        </div>
      )}
    </div>
  );
});

export default Stopwatch;
