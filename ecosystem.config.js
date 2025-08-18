module.exports = {
  apps: [
    {
      name: 'discord-bot-v2',
      script: 'npx',
      args: 'tsx src/index.ts',
      cwd: '/home/ddg171/projects/discor-bot-v2',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production'
      },
      env_development: {
        NODE_ENV: 'development',
        watch: true
      },
      time: true
    }
  ]
};
