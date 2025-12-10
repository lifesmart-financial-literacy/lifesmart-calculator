import { check, sleep } from 'k6';
import http from 'k6/http';

// Faster CI-optimized load test configuration
// Reduced duration for faster CI runs while still validating performance
export let options = {
  stages: [
    { duration: '10s', target: 5 },  // Quick ramp up to 5 users
    { duration: '20s', target: 5 },  // Stay at 5 users for 20s
    { duration: '10s', target: 10 }, // Ramp up to 10 users
    { duration: '20s', target: 10 }, // Stay at 10 users for 20s
    { duration: '10s', target: 0 }, // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'], // 95% of requests must complete below 2s
    http_req_failed: ['rate<0.1'],     // Error rate must be below 10%
  },
};

export default function () {
  // Test the main page
  let response = http.get('http://localhost:3000');

  check(response, {
    'status is 200': (r) => r.status === 200,
    'response time < 2000ms': (r) => r.timings.duration < 2000,
    'response has content': (r) => r.body.length > 0,
    'content type is HTML': (r) => r.headers['Content-Type'] && r.headers['Content-Type'].includes('text/html'),
  });

  sleep(0.5); // Reduced sleep time for faster execution

  // Test API endpoints if they exist
  let apiResponse = http.get('http://localhost:3000/api/health');
  check(apiResponse, {
    'API status is 200 or 404': (r) => r.status === 200 || r.status === 404,
  });

  sleep(0.5);
}

