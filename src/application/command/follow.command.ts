import {Inject} from '@nestjs/common'
import {Message} from 'discord.js'
import {CommandoMessage, FriendlyError} from 'discord.js-commando'

import {CommandGroup, ICommandoClient, ILogger} from '../../domain'

import {FreakbotCommand} from './freakbot.abstract-command'

export class FollowCommand extends FreakbotCommand {
    public constructor(
        @Inject('ICommandoClient') commando_client: ICommandoClient,
        @Inject('ILogger') logger: ILogger,
    ) {
        super(
            commando_client.get_client(),
            {
                name: 'follow',
                aliases: ['f'],
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

        try {
            await voice_channel.join()
        } catch (error) {
            return message.reply(`Sorry, looks like I can't follow you to ${voice_channel.name}`)
        }
        
        return message.reply(`Happy to join you in ${voice_channel.name}`)
    }
}
