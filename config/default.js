const join = require('path').join;

module.exports = {
    server_hostname: 'localhost',
    server_port: 8080,
    log_level: {
        application: 'debug',
        discord_client: 'info',
    },
    discord_client_token: '',
    discord_user_id: '',
    sound_files_path: join(__dirname, '..', 'sounds'),
};
