import joi from '@hapi/joi'
import { Module } from '@nestjs/common'
import pino from 'pino'

import { ILogger, Configuration, configuration_schema } from '../domain'
import { SoundProvider } from '../infrastructure';
import { Logger } from '../infrastructure/logger'

@Module({
    imports: [],
    controllers: [],
    providers: [
        {
            provide: 'configuration',
            useFactory(): unknown {
                return require('config').util.toObject()
            },
        },
        {
            provide: 'Configuration',
            inject: ['configuration'],
            useFactory(configuration: unknown): Configuration {
                return joi.attempt(configuration, configuration_schema)
            },
        },
        {
            provide: 'ILogger',
            inject: ['Configuration'],
            useFactory(configuration: Configuration): ILogger {
                const root_logger = pino({ prettyPrint: true, redact: ['discord_client_token'] })
                return new Logger(root_logger).set_level(configuration.log_level.application)
            },
        },
        {
            provide: 'ISoundProvider',
            useClass: SoundProvider,
        },
    ],
    exports: ['Configuration', 'ILogger', 'ISoundProvider'],
})
export class UtilModule {}
