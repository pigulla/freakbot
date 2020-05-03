import {AddressInfo} from 'net'

import {INestApplication} from '@nestjs/common'
import {NestFactory} from '@nestjs/core'
import {Logger as PinoLogger} from 'pino'
import {NormalizedPackageJson} from 'read-pkg-up'

import {Configuration, ILogger, LogLevel} from './domain'
import {Logger, adapt_for_nest} from './infrastructure/logger'
import {AppModule} from './module'
import {new_promise} from './util'

export type ShutdownFn = () => Promise<void>

async function create_application(
    root_logger: PinoLogger,
    log_level: LogLevel,
): Promise<INestApplication> {
    const logger = new Logger(root_logger).set_level(log_level)
    const nest_logger = adapt_for_nest(logger)
    const app = await NestFactory.create(AppModule, {logger: nest_logger})

    // app.useLogger(nest_logger)
    app.enableShutdownHooks()

    return app
}

export async function start_server(root_logger: PinoLogger): Promise<ShutdownFn> {
    const app = await create_application(root_logger, LogLevel.DEBUG)
    const {promise, resolve} = new_promise<void>()

    const logger = app.get<ILogger>('ILogger')
    const config = app.get<Configuration>('Configuration')
    const package_json = app.get<NormalizedPackageJson>('package.json')

    const server = await app.listen(config.server_port, config.server_hostname, () => resolve())
    await promise

    const {port, address} = server.address() as AddressInfo
    logger.info(`Application listening on ${address}:${port} (v${package_json.version})`, config)

    return () => app.close()
}
