import React, { useState, useRef } from 'react';
import Stopwatch from './Stopwatch';
import './App.css';

function App() {
  const [lanes, setLanes] = useState([]);
  const [nextLaneId, setNextLaneId] = useState(1);
  const stopwatchRefs = useRef({});

  const addLane = () => {
    setLanes([...lanes, { id: nextLaneId }]);
    setNextLaneId(nextLaneId + 1);
  };

  const closeLane = (laneId) => {
    setLanes(lanes.filter(lane => lane.id !== laneId));
    delete stopwatchRefs.current[laneId];
  };

  const handleStopAll = () => {
    Object.values(stopwatchRefs.current).forEach(ref => {
      if (ref && typeof ref.isRunningState === 'function' && typeof ref.stop === 'function') {
        if (ref.isRunningState()) {
          ref.stop();
        }
      } else {
        // Log error if ref is null or methods are missing
        if (!ref) {
          console.error("Encountered a null ref in stopwatchRefs for Stop All.");
        } else {
          const missingMethods = [];
          if (typeof ref.isRunningState !== 'function') missingMethods.push('isRunningState');
          if (typeof ref.stop !== 'function') missingMethods.push('stop');
          console.error(`Stopwatch ref is missing required methods for Stop All: ${missingMethods.join(', ')}.`);
        }
      }
    });
  };

  const handleResetAll = () => {
    Object.values(stopwatchRefs.current).forEach(ref => {
      if (ref && typeof ref.isRunningState === 'function' && typeof ref.reset === 'function') {
        if (!ref.isRunningState()) { // Only reset if not running
          ref.reset();
        }
      } else {
        // Log error if ref is null or methods are missing
        if (!ref) {
          console.error("Encountered a null ref in stopwatchRefs for Reset All.");
        } else {
          const missingMethods = [];
          if (typeof ref.isRunningState !== 'function') missingMethods.push('isRunningState');
          if (typeof ref.reset !== 'function') missingMethods.push('reset');
          console.error(`Stopwatch ref is missing required methods for Reset All: ${missingMethods.join(', ')}.`);
        }
      }
    });
  };

  const handleStartAll = () => {
    Object.values(stopwatchRefs.current).forEach(ref => {
      if (ref && typeof ref.isRunningState === 'function' && typeof ref.start === 'function') {
        if (!ref.isRunningState()) {
          ref.start();
        }
      } else {
        // Log error if ref is null or methods are missing
        if (!ref) {
          console.error("Encountered a null ref in stopwatchRefs.");
        } else {
          const missingMethods = [];
          if (typeof ref.isRunningState !== 'function') missingMethods.push('isRunningState');
          if (typeof ref.start !== 'function') missingMethods.push('start');
          console.error(`Stopwatch ref is missing required methods: ${missingMethods.join(', ')}.`);
        }
      }
    });
  };

  const handleLapAll = () => {
    Object.values(stopwatchRefs.current).forEach(ref => {
      if (ref && typeof ref.isRunningState === 'function' && typeof ref.lap === 'function') {
        if (ref.isRunningState()) {
          ref.lap();
        }
      } else {
        // Log error if ref is null or methods are missing
        if (!ref) {
          console.error("Encountered a null ref in stopwatchRefs for Lap All.");
        } else {
          const missingMethods = [];
          if (typeof ref.isRunningState !== 'function') missingMethods.push('isRunningState');
          if (typeof ref.lap !== 'function') missingMethods.push('lap');
          console.error(`Stopwatch ref is missing required methods for Lap All: ${missingMethods.join(', ')}.`);
        }
      }
    });
  };

  const handleRemoveAllRecords = () => {
    if (window.confirm("정말 모든 레인의 기록을 삭제하시겠습니까?")) {
      Object.values(stopwatchRefs.current).forEach(ref => {
        if (ref && typeof ref.clearRecords === 'function') {
          ref.clearRecords();
        } else {
          if (!ref) {
            console.error("Encountered a null ref in stopwatchRefs for Remove Records.");
          } else {
            const missingMethods = [];
            if (typeof ref.clearRecords !== 'function') missingMethods.push('clearRecords');
            console.error(`Stopwatch ref is missing required methods for Remove Records: ${missingMethods.join(', ')}.`);
          }
        }
      });
    }
  };

  return (
    <div className="App">
      <h1>Multi-Lane Stopwatch</h1>
      <button onClick={addLane}>Add Lane</button>
      <button onClick={handleStartAll}>Start All</button>
      <button onClick={handleLapAll}>Lap All</button>
      <button onClick={handleStopAll}>Stop All</button>
      <button onClick={handleResetAll}>Reset All</button>
      <button onClick={handleRemoveAllRecords}>Remove Records</button>
      <div className="lanes">
        {lanes.map((lane) => (
          <div key={lane.id}>
            <Stopwatch
              ref={(el) => stopwatchRefs.current[lane.id] = el}
              lane={lane.id}
              onClose={() => closeLane(lane.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
