import joi from '@hapi/joi'
import {Module} from '@nestjs/common'
import pino from 'pino'
import read_pkg, {NormalizedPackageJson} from 'read-pkg-up'

import {ILogger, Configuration, configuration_schema} from '../domain'
import {Logger} from '../infrastructure/logger'

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
            provide: 'package.json',
            async useFactory(): Promise<NormalizedPackageJson> {
                const pkg = await read_pkg()

                if (!pkg) {
                    throw new Error('Failed to load package.json')
                }

                return pkg.packageJson
            },
        },
        {
            provide: 'ILogger',
            inject: ['Configuration'],
            useFactory(configuration: Configuration): ILogger {
                const root_logger = pino({prettyPrint: true, redact: ['discord_client_token']})
                return new Logger(root_logger).set_level(configuration.log_level.application)
            },
        },
    ],
    exports: ['Configuration', 'ILogger', 'package.json'],
})
export class UtilityModule {}
