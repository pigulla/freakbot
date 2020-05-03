import {Message, VoiceConnection} from 'discord.js'
import {
    Command,
    CommandoMessage,
    CommandoClient,
    CommandInfo,
    FriendlyError,
} from 'discord.js-commando'

import {ILogger} from '../../domain'

export abstract class FreakbotCommand<T = void> extends Command {
    protected readonly logger: ILogger

    public constructor(
        commando_client: CommandoClient,
        command_info: CommandInfo,
        logger: ILogger,
    ) {
        super(commando_client, command_info)

        this.logger = logger.child_for_command(this)
    }

    protected abstract async do_run(msg: CommandoMessage, args: T): Promise<Message | Message[]>

    public async run(msg: CommandoMessage, args: unknown): Promise<Message | Message[]> {
        return this.do_run(msg, args as T)
    }

    protected get_voice_connection(): VoiceConnection {
        const voice_connections = this.client.voice?.connections.array()

        if (!voice_connections || voice_connections.length === 0) {
            throw new FriendlyError('You must invite the bot to a voice channel first')
        }

        return voice_connections[0]
    }
}
