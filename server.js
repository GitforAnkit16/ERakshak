import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import fetch from 'node-fetch';

const app = express();
const port = 8080;


app.use(cors());
const limiter = rateLimit({
  windowMs: 60 * 1000, 
  max: 10000, 
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/attack', limiter);
let totalRequests = 0;
let rateLimitedRequests = 0;

app.get('/metrics', (req, res) => {
  res.set('Content-Type', 'text/plain');
  res.send(`# HELP http_requests_total Total number of HTTP requests
# TYPE http_requests_total counter
http_requests_total ${totalRequests}
# HELP rate_limited_requests_total Number of requests that were rate limited
# TYPE rate_limited_requests_total counter
rate_limited_requests_total ${rateLimitedRequests}
`);
});


app.post('/attack', async (req, res) => {
  const attackType = req.query.type;
  
  if (attackType === 'http_flood') {
    
    const numRequests = 1000;
    let successfulRequests = 0;
    let failedRequests = 0;

    const requests = Array.from({ length: numRequests }, async (_, i) => {
      try {
        const response = await fetch('http://localhost:8080/attack/simulate', { method: 'GET' });
        if (response.ok) {
          successfulRequests++;
        } else {
          failedRequests++;
        }
      } catch (error) {
        failedRequests++;
      }
    });

    await Promise.all(requests);

    totalRequests += successfulRequests;
    rateLimitedRequests += failedRequests;

    res.send(`Attack simulated with ${successfulRequests} successful requests and ${failedRequests} failed requests.`);
  } else {
    res.send('Invalid attack type.');
  }
});


app.get('/attack/simulate', (req, res) => {
  totalRequests++;
  res.send('Request received.');
});


app.use((req, res, next) => {
  if (res.statusCode === 429) {
    rateLimitedRequests++;
  }
  next();
});

app.post('/reset', (req, res) => {
  totalRequests = 0;
  rateLimitedRequests = 0;
  res.send('Counters reset to zero');
});

app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).send('Internal Server Error');
});

const server = createServer(app);
server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
