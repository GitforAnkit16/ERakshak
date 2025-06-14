import React from 'react';
import './AttackSimulator.css'; 

function AttackSimulator() {
  const simulateAttack = async () => {
    try {
      const response = await fetch('http://localhost:8080/attack?type=http_flood', {
        method: 'POST',
      });

      if (response.ok) {
        const message = await response.text();
        alert(`Attack simulated successfully: ${message}`);
      } else {
        const error = await response.text();
        alert(`Error: ${error}`);
      }
    } catch (error) {
      console.error('Error triggering attack:', error);
      alert('Failed to trigger attack');
    }
  };

  const resetMetrics = async () => {
    try {
      const response = await fetch('http://localhost:8080/reset', {
        method: 'POST',
      });

      if (response.ok) {
        const message = await response.text();
        alert(`Reset Response: ${message}`);
      } else {
        const error = await response.text();
        alert(`Error: ${error}`);
      }
    } catch (error) {
      console.error('Error resetting metrics:', error);
      alert('Failed to reset metrics');
    }
  };

  return (
    <div className="attack-simulator-container">
      <button onClick={simulateAttack}>Simulate HTTP Flood Attack</button>
      <button onClick={resetMetrics}>Reset Metrics</button>
    </div>
  );
}

export default AttackSimulator;
