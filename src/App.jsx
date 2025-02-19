import React, { useState } from 'react';
import Stopwatch from './Stopwatch';
import './App.css';

function App() {
  const [lanes, setLanes] = useState([]);
  const [nextLaneId, setNextLaneId] = useState(1);

  const addLane = () => {
    setLanes([...lanes, { id: nextLaneId }]);
    setNextLaneId(nextLaneId + 1);
  };

  const closeLane = (laneId) => {
    setLanes(lanes.filter(lane => lane.id !== laneId));
  };

  return (
    <div className="App">
      <h1>Multi-Lane Stopwatch</h1>
      <button onClick={addLane}>Add Lane</button>
      <div className="lanes">
        {lanes.map((lane) => (
          <div key={lane.id}>
            <Stopwatch 
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
