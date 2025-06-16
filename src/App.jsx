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

  // Save 버튼 기능: 모든 레인의 기록을 txt로 저장
  const handleSaveRecords = async () => {
    let allRecords = '';
    Object.entries(stopwatchRefs.current).forEach(([laneId, ref]) => {
      if (ref && typeof ref.getFormattedRecords === 'function') {
        allRecords += `Lane ${laneId} Records\n`;
        allRecords += ref.getFormattedRecords() + '\n\n';
      }
    });
    const filename = window.prompt('저장할 파일명을 입력하세요', 'records.txt');
    if (!filename) return;
    const blob = new Blob([allRecords], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename.endsWith('.txt') ? filename : filename + '.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Remove Records 버튼: Yes/No 커스텀 다이얼로그
  const handleRemoveAllRecords = () => {
    const dialog = document.createElement('div');
    dialog.style.position = 'fixed';
    dialog.style.top = '0';
    dialog.style.left = '0';
    dialog.style.width = '100vw';
    dialog.style.height = '100vh';
    dialog.style.background = 'rgba(0,0,0,0.3)';
    dialog.style.display = 'flex';
    dialog.style.alignItems = 'center';
    dialog.style.justifyContent = 'center';
    dialog.style.zIndex = '9999';
    dialog.innerHTML = `
      <div style="background:white;padding:32px 24px;border-radius:10px;box-shadow:0 2px 12px #0002;text-align:center;min-width:260px;">
        <div style="font-size:1.1rem;margin-bottom:18px;">기록을 삭제하기 전에 저장하시겠습니까?</div>
        <button id="yesBtn" style="margin:0 12px;padding:8px 24px;background:#4CAF50;color:white;border:none;border-radius:4px;font-size:1rem;">Yes</button>
        <button id="noBtn" style="margin:0 12px;padding:8px 24px;background:#2196F3;color:white;border:none;border-radius:4px;font-size:1rem;">No</button>
      </div>
    `;
    document.body.appendChild(dialog);
    dialog.querySelector('#yesBtn').onclick = () => {
      handleSaveRecords();
      Object.values(stopwatchRefs.current).forEach(ref => {
        if (ref && typeof ref.clearRecords === 'function') {
          ref.clearRecords();
        }
      });
      document.body.removeChild(dialog);
    };
    dialog.querySelector('#noBtn').onclick = () => {
      Object.values(stopwatchRefs.current).forEach(ref => {
        if (ref && typeof ref.clearRecords === 'function') {
          ref.clearRecords();
        }
      });
      document.body.removeChild(dialog);
    };
  };

  // Reset All: 시간만 0으로, 기록은 유지
  const handleResetAll = () => {
    Object.values(stopwatchRefs.current).forEach(ref => {
      if (ref && typeof ref.resetTimeOnly === 'function') {
        ref.resetTimeOnly();
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

  // Lap All: Lap 버튼과 동일하게, 시작 전이면 start도 기록
  const handleLapAll = () => {
    Object.values(stopwatchRefs.current).forEach(ref => {
      if (ref && typeof ref.isRunningState === 'function' && typeof ref.lap === 'function') {
        if (ref.isRunningState()) {
          // Lap 버튼과 동일하게, 시작 전이면 start도 기록
          if (typeof ref.ensureStarted === 'function') {
            ref.ensureStarted();
          }
          ref.lap();
        }
      } else {
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

  return (
    <div className="App">
      <h1>Multi-Lane Stopwatch</h1>
      <div className="top-controls">
        <button onClick={addLane}>Add Lane</button>
        <button onClick={handleStartAll}>Start All</button>
        <button onClick={handleLapAll}>Lap All</button>
        <button onClick={handleStopAll}>Stop All</button>
        <button onClick={handleResetAll}>Reset All</button>
        <button onClick={handleRemoveAllRecords}>Remove Records</button>
        <button onClick={handleSaveRecords}>Save</button>
      </div>
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
