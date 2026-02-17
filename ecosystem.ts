// PM2 Ecosystem Configuration for Frontend
// Usage: pm2 start ecosystem.ts --interpreter ts-node
// Or compile to JS: tsc ecosystem.ts && pm2 start ecosystem.js

const ecosystemConfig = {
  apps: [
    {
      name: 'cafe-del-valle-frontend',
      script: 'npx',
      args: 'ng serve --host 0.0.0.0 --port 4200',
      cwd: process.cwd(),
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 4200,
      },
      error_file: './logs/frontend-error.log',
      out_file: './logs/frontend-out.log',
      log_file: './logs/frontend-combined.log',
      time: true,
      merge_logs: true,
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s',
    },
    // Alternative: Serve built Angular app with a simple HTTP server
    // Use this after running: npm run build
    {
      name: 'cafe-del-valle-frontend-serve',
      script: 'npx',
      args: 'http-server dist/cafe-del-valle-frontend/browser -p 4200 -a 0.0.0.0 --cors',
      cwd: process.cwd(),
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'production',
        PORT: 4200,
      },
      error_file: './logs/frontend-error.log',
      out_file: './logs/frontend-out.log',
      log_file: './logs/frontend-combined.log',
      time: true,
      merge_logs: true,
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s',
    },
  ],
};

export default ecosystemConfig;
