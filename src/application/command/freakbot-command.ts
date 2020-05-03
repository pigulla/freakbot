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

    protected abstract async do_run(message: CommandoMessage, args: T): Promise<Message | Message[]>

    public async run(message: CommandoMessage, args: unknown): Promise<Message | Message[]> {
        const {content, author} = message
        const user_id = `${author.username}#${author.discriminator}`

        this.logger.trace(`Processing message`, {user_id, content})

        try {
            const result = await this.do_run(message, args as T)
            this.logger.debug('Message processed', {user_id, content})
            return result
        } catch (error) {
            if (error instanceof FriendlyError) {
                this.logger.debug('Message processing unsuccessful', {
                    user_id,
                    content,
                    error_message: error.message,
                })
            } else {
                this.logger.warn('Message processing failed', {
                    user_id,
                    content,
                    error_message: error.message,
                })
            }

            throw error
        }
    }

    protected get_voice_connection(): VoiceConnection {
        const voice_connections = this.client.voice?.connections.array()

        if (!voice_connections || voice_connections.length === 0) {
            throw new FriendlyError('You must invite the bot to a voice channel first')
        }

        return voice_connections[0]
    }
}
