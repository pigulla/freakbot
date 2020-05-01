import { AddressInfo, Server } from 'net';

import { INestApplication, LoggerService } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import pino from 'pino';

import { Configuration, ILogger, LogLevel } from './domain';
import { Logger, adapt_for_nest } from './infrastructure/logger';
import { AppModule } from './module';
import { new_promise } from './util';

type ShutdownFn = () => Promise<void>

function create_logger (log_level: LogLevel): Required<LoggerService> {
    const pino_instance = pino({prettyPrint: true})
    const root_logger = new Logger(pino_instance).set_level(log_level)

    return adapt_for_nest(root_logger)
}

async function create_app (log_level: LogLevel): Promise<INestApplication> {
    const logger = create_logger(log_level)
    const app = await NestFactory.create(AppModule, { logger })

    app.useLogger(logger)
    app.enableShutdownHooks()

    return app
}

export async function start_server (): Promise<ShutdownFn> {
    const {promise, resolve} = new_promise<ShutdownFn>()

    const app = await create_app(LogLevel.DEBUG)
    const logger = app.get<ILogger>('ILogger')
    const config = app.get<Configuration>('Configuration')
    const server = app.getHttpServer() as Server

    server.once('listening', function () {
        const address = server.address() as AddressInfo

        logger.info(`Application listening on ${address.address}:${address.port}`, config)
        resolve(() => app.close())
    })

    await app.listen(config.server_port, config.server_hostname)

    return promise
}
