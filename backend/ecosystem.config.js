module.exports = {
    apps: [{
        name: "shishu-backend",
        script: "./server.js",
        instances: 1, // Or "max" for clustering, but with Google Sheets singleton, 1 is safer
        autorestart: true,
        watch: false,
        max_memory_restart: '1G',
        env: {
            NODE_ENV: "development",
        },
        env_production: {
            NODE_ENV: "production",
        }
    }]
};
