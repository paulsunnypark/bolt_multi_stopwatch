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
      if (ref && typeof ref.stop === 'function') {
        ref.stop();
      } else {
        console.error('Stopwatch ref does not have a stop method or is null.');
      }
    });
  };

  const handleResetAll = () => {
    Object.values(stopwatchRefs.current).forEach(ref => {
      if (ref && typeof ref.reset === 'function') {
        ref.reset();
      } else {
        console.error('Stopwatch ref does not have a reset method or is null.');
      }
    });
  };

  const handleRestartAll = () => {
    Object.values(stopwatchRefs.current).forEach(ref => {
      if (ref) {
        if (typeof ref.reset === 'function') {
          ref.reset();
        } else {
          console.error('Stopwatch ref does not have a reset method.');
        }
        if (typeof ref.start === 'function') {
          ref.start();
        } else {
          console.error('Stopwatch ref does not have a start method.');
        }
      } else {
        console.error('Stopwatch ref is null.');
      }
    });
  };

  return (
    <div className="App">
      <h1>Multi-Lane Stopwatch</h1>
      <button onClick={addLane}>Add Lane</button>
      <button onClick={handleStopAll}>Stop All</button>
      <button onClick={handleResetAll}>Reset All</button>
      <button onClick={handleRestartAll}>Restart All</button>
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
