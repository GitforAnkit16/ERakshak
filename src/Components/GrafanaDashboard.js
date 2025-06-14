import React from 'react';

const GrafanaDashboard = () => {
  return (
    <div>
      <h1>Grafana Dashboard</h1>
      <iframe src="http://localhost:3000/d-solo/rpfmFFz7z/prometheus-stats?orgId=1&from=1726723294272&to=1726723594273&panelId=2" width="450" height="200" frameborder="0"></iframe>
      <iframe src="http://localhost:3000/d-solo/rpfmFFz7z/prometheus-stats?orgId=1&from=1726723343271&to=1726723643271&panelId=14" width="450" height="200" frameborder="0"></iframe></div>
  );
};

export default GrafanaDashboard;
