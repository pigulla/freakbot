import {Inject} from '@nestjs/common'
import {Message} from 'discord.js'
import {CommandoMessage, CommandoClient, FriendlyError} from 'discord.js-commando'

import {CommandGroup, ILogger} from '../../domain'

import {FreakbotCommand} from './freakbot-command'

export class FollowCommand extends FreakbotCommand {
    public constructor(
        @Inject('CommandoClient') commando_client: CommandoClient,
        @Inject('ILogger') logger: ILogger,
    ) {
        super(
            commando_client,
            {
                name: 'follow',
                aliases: [],
                group: CommandGroup.SOUND,
                memberName: 'follow',
                description: 'Follow to your voice channel.',
                guildOnly: true,
            },
            logger,
        )

        this.logger.debug('Service instantiated')
    }

    protected async do_run(message: CommandoMessage): Promise<Message | Message[]> {
        const voice_channel = message.member.voice.channel

        if (!voice_channel) {
            throw new FriendlyError('You must be in a voice channel to use this command.')
        }

        await voice_channel.join()
        return message.reply(`Happy to join you in ${voice_channel.name}`)
    }
}
