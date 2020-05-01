import {Message} from 'discord.js'
import {Command, CommandoMessage, CommandoClient, CommandInfo} from 'discord.js-commando'

import {ILogger} from '../../domain'

export abstract class AbstractCommand<T extends object> extends Command {
    protected readonly logger: ILogger

    public constructor(
        commando_client: CommandoClient,
        command_info: CommandInfo,
        logger: ILogger,
    ) {
        super(commando_client, command_info)

        this.logger = logger.child_for_command_handler(Object.getPrototypeOf(this).name)
    }

    protected abstract async do_run(msg: CommandoMessage, args: T): Promise<Message | Message[]>

    public async run(msg: CommandoMessage, args: unknown): Promise<Message | Message[]> {
        return this.do_run(msg, args as T)
    }
}
