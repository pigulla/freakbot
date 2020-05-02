import {INestApplicationContext, LoggerService} from '@nestjs/common'
import {NestFactory} from '@nestjs/core'
import pino from 'pino'
import {NormalizedPackageJson} from 'read-pkg-up'

import {Configuration, ILogger, ISoundProvider, LogLevel} from './domain'
import {Logger, adapt_for_nest} from './infrastructure/logger'
import {AppModule} from './module'

function create_logger(log_level: LogLevel): Required<LoggerService> {
    const pino_instance = pino({prettyPrint: true})
    const root_logger = new Logger(pino_instance).set_level(log_level)

    return adapt_for_nest(root_logger)
}

async function create_application(log_level: LogLevel): Promise<INestApplicationContext> {
    const logger = create_logger(log_level)
    const app = await NestFactory.createApplicationContext(AppModule, {logger})

    app.useLogger(logger)
    app.enableShutdownHooks()

    return app
}

export async function start_application(): Promise<INestApplicationContext> {
    const app = await create_application(LogLevel.DEBUG)
    const logger = app.get<ILogger>('ILogger')
    const config = app.get<Configuration>('Configuration')
    const package_json = app.get<NormalizedPackageJson>('package.json')
    const sound_provider = app.get<ISoundProvider>('ISoundProvider')

    logger.info(`Application started (v${package_json.version})`, config)
    logger.debug(`Sounds available: ${sound_provider.size}`)

    return app
}
