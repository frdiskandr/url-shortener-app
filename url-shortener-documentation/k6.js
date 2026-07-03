import http from 'k6/http';
import { check, group, sleep } from 'k6';
import { Rate, Trend, Counter, Gauge } from 'k6/metrics';

// Custom metrics
const errorRate = new Rate('errors');
const responseTimes = new Trend('response_times');
const successCount = new Counter('success_requests');
const failureCount = new Counter('failed_requests');
const throughput = new Gauge('throughput');

// Configuration
export const options = {
  // Ramping up untuk realistic load
  stages: [
    { duration: '30s', target: 50 },   // Ramp-up: 0 to 5 users over 30s
    { duration: '1m30s', target: 100 }, // Ramp-up: 5 to 10 users over 1m30s
    { duration: '20s', target: 50 },    // Ramp-down: 10 to 0 users over 20s
  ],

  // Thresholds untuk quality gates
  thresholds: {
    'response_times': ['p(95)<500', 'p(99)<1000'], // 95% responses under 500ms, 99% under 1000ms
    'errors': ['rate<0.1'],                         // Error rate under 10%
    'success_requests': ['count>100'],              // At least 100 successful requests
  },

  // Options lainnya
  insecureSkipTLSVerify: true,
  noConnectionReuse: false,
  userAgent: 'k6/BenchmarkTest',
};

// Base URL
const BASE_URL = 'http://localhost:3030';
const ENDPOINT = '/zuli';

export default function () {
  // Group untuk organizational purposes di report
  group('GET /zuli - Benchmark Test', function () {
    // Make request
    const response = http.get(`${BASE_URL}${ENDPOINT}`);

    // Track response time
    responseTimes.add(response.timings.duration);

    // Validasi response dengan checks
    const checkResult = check(response, {
      'status is 200': (r) => r.status === 200,
      'response time < 500ms': (r) => r.timings.duration < 500,
      'response time < 1000ms': (r) => r.timings.duration < 1000,
      'has content': (r) => r.body && r.body.length > 0,
      'response type is json': (r) => r.headers['Content-Type'].includes('application/json'),
    });

    // Track success/failure
    if (checkResult) {
      successCount.add(1);
    } else {
      failureCount.add(1);
      errorRate.add(1);
    }

    // Log untuk debugging
    if (response.status !== 200) {
      console.error(`Request failed with status ${response.status}: ${response.body}`);
    }
  });

  // Think time - simulasi user behavior
//  sleep(1);
}

// Setup untuk initialize test
export function setup() {
  console.log('Starting benchmark for /zuli endpoint');
  return { startTime: new Date() };
}

// Teardown untuk cleanup
export function teardown(data) {
  console.log(`Benchmark completed. Started at: ${data.startTime}`);
}
