import {AddressInfo, Server} from 'net'

import {INestApplication, LoggerService} from '@nestjs/common'
import {NestFactory} from '@nestjs/core'
import pino from 'pino'
import {NormalizedPackageJson} from 'read-pkg-up'

import {Configuration, ILogger, ISoundProvider, LogLevel} from './domain'
import {Logger, adapt_for_nest} from './infrastructure/logger'
import {AppModule} from './module'
import {new_promise} from './util'

type ShutdownFn = () => Promise<void>

function create_logger(log_level: LogLevel): Required<LoggerService> {
    const pino_instance = pino({prettyPrint: true})
    const root_logger = new Logger(pino_instance).set_level(log_level)

    return adapt_for_nest(root_logger)
}

async function create_application(log_level: LogLevel): Promise<INestApplication> {
    const logger = create_logger(log_level)
    const app = await NestFactory.create(AppModule)
    // const app = await NestFactory.create(AppModule, {logger})

    app.useLogger(logger)
    app.enableShutdownHooks()

    return app
}

export async function start_server(): Promise<ShutdownFn> {
    const {promise, resolve} = new_promise<ShutdownFn>()
    const app = await create_application(LogLevel.DEBUG)

    const logger = app.get<ILogger>('ILogger')
    const config = app.get<Configuration>('Configuration')
    const package_json = app.get<NormalizedPackageJson>('package.json')
    const sound_provider = app.get<ISoundProvider>('ISoundProvider')
    const server = app.getHttpServer() as Server

    server.once('listening', function () {
        const {port, address} = server.address() as AddressInfo

        logger.info(
            `Application listening on ${address}:${port} (v${package_json.version})`,
            config,
        )
        logger.debug(`Sounds available: ${sound_provider.size}`)
        resolve(() => app.close())
    })

    await app.listen(config.server_port, config.server_hostname)

    return promise
}
