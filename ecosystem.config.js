const path = require('path');

module.exports = {
  apps: [
    {
      name: 'discord-bot-v2',
      script: 'npx',
      args: path.resolve(__dirname, 'node_modules', '.bin', 'tsx') + ' ' + path.resolve(__dirname, 'src', 'index.ts'),
      cwd: path.resolve(__dirname),
      instances: 1,
      autorestart: false,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production'
      },
      env_development: {
        NODE_ENV: 'development',
        watch: true
      },
      error_file: path.resolve(__dirname, 'logs', 'err.log'),
      out_file: path.resolve(__dirname, 'logs', 'out.log'),
      log_file: path.resolve(__dirname, 'logs', 'combined.log'),
      time: true
    }
  ]
};
