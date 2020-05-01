import { forwardRef, Module } from '@nestjs/common';

import { UtilModule } from './util.module';
import * as commands from '../application/command';
import { AbstractCommand, CommandHandlerMap } from '../domain';
import { DiscordModule } from './discord.module';

const all_commands = Object.values(commands)

@Module({
    imports: [UtilModule, forwardRef(() => DiscordModule)],
    controllers: [],
    providers: [
        ...all_commands,
        {
            provide: 'CommandHandlers',
            inject: [...all_commands],
            useFactory(...args: AbstractCommand[]): CommandHandlerMap {
                return args.reduce((map: CommandHandlerMap, handler: AbstractCommand) => {
                    const name = handler.get_command_name()
                    
                    if (map.has(name)) {
                        throw new Error(`A handler for command "${name}" was already registered`)
                    }
                    
                    return map.set(name, handler)
                }, new Map())
            }
        }
    ],
    exports: ['CommandHandlers'],
})
export class ClientCommandModule {}
