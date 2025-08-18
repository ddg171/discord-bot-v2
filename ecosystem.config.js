const path = require('path');
const dotenv = require('dotenv');

// プロジェクトルート
const projectRoot = path.resolve(__dirname);

// .envファイルを読み込み
const envConfig = dotenv.config({ path: path.join(projectRoot, '.env') }).parsed || {};

module.exports = {
  apps: [
    {
      name: 'discord-bot-v2',
      script: path.join(projectRoot, 'node_modules', '.bin', 'ts-node'),
      args: 'src/index.ts',
      cwd: projectRoot,
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PATH: process.env.PATH,
        ...envConfig
      },
      env_development: {
        NODE_ENV: 'development',
        PATH: process.env.PATH,
        ...envConfig
      },
      time: true,
      log_file: path.join(projectRoot, 'logs', 'combined.log'),
      out_file: path.join(projectRoot, 'logs', 'out.log'),
      error_file: path.join(projectRoot, 'logs', 'error.log'),
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true
    }
  ]
};
