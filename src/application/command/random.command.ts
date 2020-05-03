import {Inject} from '@nestjs/common'
import {Message} from 'discord.js'
import {CommandoMessage, CommandoClient, FriendlyError} from 'discord.js-commando'
import sample from 'lodash.sample'

import {CommandGroup, ILogger, ISoundProvider} from '../../domain'

import {FreakbotCommand} from './freakbot-command'

export class RandomCommand extends FreakbotCommand<string> {
    private readonly sound_provider: ISoundProvider

    public constructor(
        @Inject('CommandoClient') commando_client: CommandoClient,
        @Inject('ISoundProvider') sound_provider: ISoundProvider,
        @Inject('ILogger') logger: ILogger,
    ) {
        super(
            commando_client,
            {
                name: 'random',
                aliases: [],
                group: CommandGroup.SOUND,
                memberName: 'random',
                description: 'Plays a random sound.',
                guildOnly: true,
                argsType: 'single',
            },
            logger,
        )

        this.sound_provider = sound_provider

        this.logger.debug('Service instantiated')
    }

    protected async do_run(message: CommandoMessage, input: string): Promise<Message | Message[]> {
        const search_term = input.trim()
        const sound = sample(
            search_term ? this.sound_provider.search(input) : this.sound_provider.list(),
        )

        if (!sound) {
            throw new FriendlyError('No matching sound found')
        }

        await this.get_voice_connection().play(sound.filename)
        return message.reply(sound.title)
    }
}
