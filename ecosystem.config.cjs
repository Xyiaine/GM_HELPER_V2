module.exports = {
  apps: [
    {
      name: 'gm-helper-server',
      script: './server/src/index.js',
      cwd: './',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      env_file: './server/.env',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      error_file: './logs/pm2-err.log',
      out_file: './logs/pm2-out.log',
    },
  ],
};
