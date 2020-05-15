import {SinonStubbedInstance} from 'sinon'

import {Configuration, LogLevel} from '~src/domain'

export function mock_configuration(): SinonStubbedInstance<Configuration> {
    return {
        server_hostname: 'localhost',
        server_port: 4711,
        log_level: {
            application: LogLevel.FATAL,
            discord_client: LogLevel.WARN,
        },
        discord_client_token: 'discord-licent-token',
        discord_user_id: 'discord-user-id',
        voicepack_path: '/dev/null/voicepack',
    }
}
