import joi from '@hapi/joi'
import {Module} from '@nestjs/common'
import {Logger as PinoLogger} from 'pino'
import read_pkg, {NormalizedPackageJson} from 'read-pkg-up'

import {Uptime} from '../application'
import {ILogger, Configuration, configuration_schema} from '../domain'
import {Logger} from '../infrastructure/logger'
import {get_root_logger} from '../root-logger'

@Module({
    imports: [],
    controllers: [],
    providers: [
        {
            provide: 'root-logger',
            useFactory(): PinoLogger {
                return get_root_logger()
            },
        },
        {
            provide: 'configuration-object',
            useFactory(): unknown {
                return require('config').util.toObject()
            },
        },
        {
            provide: 'Configuration',
            inject: ['configuration-object'],
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
            inject: ['Configuration', 'root-logger'],
            useFactory(configuration: Configuration, root_logger: PinoLogger): ILogger {
                return new Logger(root_logger).set_level(configuration.log_level.application)
            },
        },
        {
            provide: 'IUptime',
            useClass: Uptime,
        },
    ],
    exports: ['Configuration', 'ILogger', 'IUptime', 'package.json'],
})
export class UtilityModule {}
