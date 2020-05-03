import {FreakbotCommand} from '../application/command/freakbot.abstract-command'

export type ChildLoggerOptions = {
    level?: LogLevel
    [key: string]: any
}

export enum LogLevel {
    FATAL = 'fatal',
    ERROR = 'error',
    WARN = 'warn',
    INFO = 'info',
    DEBUG = 'debug',
    TRACE = 'trace',
}

export interface ILogger {
    set_level(level: LogLevel): this
    child(child_options: ChildLoggerOptions): ILogger
    child_for_service(service: object): ILogger
    child_for_command(command: FreakbotCommand<any>): ILogger
    child_for_controller(controller: object): ILogger

    fatal(message: string, object?: object): void
    error(message: string, object?: object): void
    warn(message: string, object?: object): void
    info(message: string, object?: object): void
    debug(message: string, object?: object): void
    trace(message: string, object?: object): void
}
