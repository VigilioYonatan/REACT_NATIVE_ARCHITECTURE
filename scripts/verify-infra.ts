import net from 'node:net';
import http from 'node:http';

const COLORS = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

const log = (service: string, status: 'UP' | 'DOWN' | 'CHECKING', message = '') => {
  let color = COLORS.blue;
  if (status === 'UP') color = COLORS.green;
  if (status === 'DOWN') color = COLORS.red;
  
  console.log(`${color}[${service}] ${status}${COLORS.reset} ${message}`);
};

const checkPort = (service: string, host: string, port: number): Promise<boolean> => {
  return new Promise((resolve) => {
    log(service, 'CHECKING', `Connecting to ${host}:${port}...`);
    const socket = new net.Socket();
    
    socket.setTimeout(2000);
    
    socket.on('connect', () => {
      log(service, 'UP', `Successfully connected to ${host}:${port}`);
      socket.destroy();
      resolve(true);
    });
    
    socket.on('timeout', () => {
      log(service, 'DOWN', `Timeout connecting to ${host}:${port}`);
      socket.destroy();
      resolve(false);
    });
    
    socket.on('error', (err) => {
      log(service, 'DOWN', `Error connecting to ${host}:${port}: ${err.message}`);
      resolve(false);
    });
    
    socket.connect(port, host);
  });
};

const checkHttp = (service: string, url: string): Promise<boolean> => {
  return new Promise((resolve) => {
      log(service, 'CHECKING', `Requesting ${url}...`);
      const req = http.get(url, (res) => {
          if (res.statusCode === 200) {
              log(service, 'UP', `Status Code: ${res.statusCode}`);
              resolve(true);
          } else {
              log(service, 'DOWN', `Status Code: ${res.statusCode}`);
              resolve(false);
          }
      });

      req.on('error', (err) => {
          log(service, 'DOWN', `Error: ${err.message}`);
          resolve(false);
      });
      
      req.setTimeout(2000, () => {
          req.destroy();
          log(service, 'DOWN', 'Timeout');
          resolve(false);
      });
  });
};

async function main() {
  console.log(`${COLORS.yellow}Starting Infrastructure Check...${COLORS.reset}\n`);
  
  const results = await Promise.all([
    checkPort('Postgres', 'postgres', 5432),
    checkPort('Redis', 'valkey', 6379),
    checkHttp('LocalStack', 'http://localstack:4566/_localstack/health'),
    checkHttp('MailHog API', 'http://mailhog:8025/'),
    checkPort('MailHog SMTP', 'mailhog', 1025),
  ]);

  console.log(`\n${COLORS.yellow}Summary:${COLORS.reset}`);
  const allUp = results.every(r => r);
  if (allUp) {
    console.log(`${COLORS.green}All systems operational! 🚀${COLORS.reset}`);
    process.exit(0);
  } else {
    console.log(`${COLORS.red}Some systems are down. Please check docker-compose logs.${COLORS.reset}`);
    process.exit(1);
  }
}

main();
