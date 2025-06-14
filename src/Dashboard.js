import React, { useEffect, useState } from 'react';
import './Dashboard.css'; 

const Dashboard = () => {
  const [httpRequests, setHttpRequests] = useState(0);
  const [rateLimit, setRateLimit] = useState(0);
  const [error, setError] = useState(null);

  const MAX_HTTP_REQUESTS = 10000;
  const MAX_RATE_LIMIT = 10000;

  const fetchMetrics = async () => {
    try {
      const response = await fetch('http://localhost:8080/metrics');
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const text = await response.text();
      console.log('Metrics response:', text);

      const httpRequestsMatch = text.match(/http_requests_total\s+(\d+)/);
      const rateLimitMatch = text.match(/rate_limited_requests_total\s+(\d+)/);

      if (httpRequestsMatch && rateLimitMatch) {
        setHttpRequests(parseInt(httpRequestsMatch[1], 10));
        setRateLimit(parseInt(rateLimitMatch[1], 10));
      } else {
        console.error('Failed to match HTTP requests or rate limit in the response.');
      }
    } catch (err) {
      console.error('Error fetching metrics:', err);
      setError('Failed to fetch metrics');
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
        fetchMetrics();
      } else {
        const error = await response.text();
        alert(`Error: ${error}`);
      }
    } catch (error) {
      console.error('Error resetting metrics:', error);
      alert('Failed to reset metrics');
    }
  };

  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 5000);
    return () => clearInterval(interval);
  }, []);

  
  const httpRequestFill = Math.min((httpRequests / MAX_HTTP_REQUESTS) * 100, 100);
  const rateLimitFill = Math.min((rateLimit / MAX_RATE_LIMIT) * 100, 100);

  return (
    <div className="dashboard-container">
      <h1>Metrics Dashboard</h1>
      {error && <p className="error-message">{error}</p>}
      <div className="metric-box">
        <div className="metric-number">{httpRequests}</div>
        <div className="metric-title">Total HTTP Requests</div>
        <div className="metric-indicator">
          <div className="indicator-label">Requests:</div>
          <div className="indicator-bar">
            <div
              className="indicator-fill http-requests"
              style={{ width: `${httpRequestFill}%` }}
            >
             
            </div>
          </div>
        </div>
      </div>
      <div className="metric-box">
        <div className="metric-number">{rateLimit}</div>
        <div className="metric-title">Rate Limited Requests</div>
        <div className="metric-indicator">
          <div className="indicator-label">Rate Limits:</div>
          <div className="indicator-bar">
            <div
              className="indicator-fill rate-limit"
              style={{ width: `${rateLimitFill}%` }}
            >
              
            </div>
          </div>
        </div>
      </div>
      <button className="reset-button" onClick={resetMetrics}>
        Reset Metrics
      </button>
    </div>
  );
};

export default Dashboard;
