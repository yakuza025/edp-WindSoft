module.exports = {
  apps: [
    {
      name: 'windsoft-api',
      cwd: '/var/www/html/edp-WindSoft/edp-windsoft-api',
      script: 'src/server.js',
      exec_mode: 'fork',
      instances: 1,
      autorestart: true,
      max_memory_restart: '300M',
      env: { NODE_ENV: 'production', PORT: 3021 },
    },
    {
      name: 'windsoft-ui',
      cwd: '/var/www/html/edp-WindSoft/edp-windsoft-ui',
      script: 'node_modules/vite/bin/vite.js',
      args: 'preview --port 5091 --host 0.0.0.0',
      exec_mode: 'fork',
      instances: 1,
      autorestart: true,
      max_memory_restart: '300M',
      env: { NODE_ENV: 'production' },
    },
  ],
};
