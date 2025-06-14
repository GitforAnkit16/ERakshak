
import React, { useState } from 'react';
import AttackSimulator from './AttackSimulator';
import Dashboard from './Dashboard';
import './App.css';
function App() {
  return (
    <div className="App">
      <h1>DDoS Protection System</h1>
      <AttackSimulator />
      <Dashboard />
    </div>
  );
}

export default App;
