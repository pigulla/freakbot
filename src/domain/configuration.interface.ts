import joi from '@hapi/joi';

import { LogLevel } from './logger.interface';

export interface Configuration {
    readonly server_hostname: string
    readonly server_port: number

    readonly log_level: {
        readonly application: LogLevel
        readonly discord_client: LogLevel
    }

    readonly discord_client_token: string

    readonly sound_files_path: string
}

const log_level = joi
    .string()
    .allow(...Object.values(LogLevel))
    .only()
    .required()

export const configuration_schema = joi.object().keys({
    server_hostname: joi.string().min(1).required(),
    server_port: joi.number().port().required(),
    log_level: joi.object().keys({
        application: log_level,
        discord_client: log_level,
    }).required(),
    discord_client_token: joi.string().min(1).required(),
    sound_files_path: joi.string().min(1).required(),
})
