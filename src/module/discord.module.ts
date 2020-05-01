import { Module } from '@nestjs/common';

import { Discord, Dispatcher } from '../application';
import * as commands from '../application/command';
import { AbstractCommand, CommandHandlerMap, ILogger } from '../domain';
import { DiscordClient } from '../infrastructure'

import { UtilModule } from './util.module'

const all_commands = Object.values(commands)

@Module({
    imports: [UtilModule],
    controllers: [],
    providers: [
        ...all_commands,
        {
            provide: 'CommandHandlers',
            inject: ['ILogger', ...all_commands],
            useFactory(logger: ILogger, ...args: AbstractCommand[]): CommandHandlerMap {
                logger.trace('Assembling command handlers')

                const handlers = args.reduce((map: CommandHandlerMap, handler: AbstractCommand) => {
                    const name = handler.get_command_name()

                    if (map.has(name)) {
                        throw new Error(`A handler for command "${name}" was already registered`)
                    }

                    return map.set(name, handler)
                }, new Map())

                logger.debug('Command handlers registered', { handlers: [...handlers.keys()] })
                return handlers
            }
        },
        {
            provide: 'IDiscordClient',
            useClass: DiscordClient,
        },
        {
            provide: 'IDiscord',
            useClass: Discord,
        },
        {
            provide: 'IDispatcher',
            useClass: Dispatcher,
        },
    ],
    exports: [],
})
export class DiscordModule {}
