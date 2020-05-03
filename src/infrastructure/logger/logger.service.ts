import {Injectable} from '@nestjs/common'
import {Logger as Pino} from 'pino'

import {FreakbotCommand} from '../../application/command/freakbot.abstract-command'
import {ILogger, ChildLoggerOptions, LogLevel} from '../../domain'
import {ctor_name} from '../../util'

@Injectable()
export class Logger implements ILogger {
    private readonly pino: Pino

    public constructor(pino: Pino) {
        this.pino = pino
    }

    public set_level(level: LogLevel): this {
        this.pino.level = level
        return this
    }

    public child(options: ChildLoggerOptions = {}): ILogger {
        return new Logger(this.pino.child(options))
    }

    public child_for_service(service: object, options: ChildLoggerOptions = {}): ILogger {
        return this.child({...options, service: ctor_name(service)})
    }

    public child_for_command(
        command: FreakbotCommand<any>,
        options: ChildLoggerOptions = {},
    ): ILogger {
        return this.child({...options, command: ctor_name(command)})
    }

    public child_for_controller(controller: object, options: ChildLoggerOptions = {}): ILogger {
        return this.child({...options, controller: ctor_name(controller)})
    }

    public fatal(message: string, object: object = {}): void {
        this.pino.fatal(object, message)
    }

    public error(message: string, object: object = {}): void {
        this.pino.error(object, message)
    }

    public warn(message: string, object: object = {}): void {
        this.pino.warn(object, message)
    }

    public info(message: string, object: object = {}): void {
        this.pino.info(object, message)
    }

    public debug(message: string, object: object = {}): void {
        this.pino.debug(object, message)
    }

    public trace(message: string, object: object = {}): void {
        this.pino.trace(object, message)
    }
}
