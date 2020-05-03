import {Inject} from '@nestjs/common'
import {Message} from 'discord.js'
import {CommandoMessage, FriendlyError} from 'discord.js-commando'
import sample from 'lodash.sample'

import {CommandGroup, ICommandoClient, ILogger, ISoundProvider} from '../../domain'

import {FreakbotSoundCommand} from './freakbot.sound-command'

export class RandomCommand extends FreakbotSoundCommand<string> {
    public constructor(
        @Inject('ICommandoClient') commando_client: ICommandoClient,
        @Inject('ISoundProvider') sound_provider: ISoundProvider,
        @Inject('ILogger') logger: ILogger,
    ) {
        super(
            commando_client.get_client(),
            {
                name: 'random',
                aliases: ['rnd'],
                group: CommandGroup.SOUND,
                memberName: 'random',
                description: 'Play a random sound.',
                guildOnly: true,
                argsType: 'single',
            },
            sound_provider,
            logger,
        )

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

        await this.play_sound(message.author, sound)
        return message.reply(sound.title)
    }
}
