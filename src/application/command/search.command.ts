import {Inject} from '@nestjs/common'
import {Message} from 'discord.js'
import {CommandoMessage} from 'discord.js-commando'

import {CommandGroup, ICommandoClient, ILogger, ISoundProvider} from '../../domain'

import {FreakbotCommand} from './freakbot.abstract-command'

export class SearchCommand extends FreakbotCommand<string> {
    private readonly sound_provider: ISoundProvider

    public constructor(
        @Inject('ICommandoClient') commando_client: ICommandoClient,
        @Inject('ISoundProvider') sound_provider: ISoundProvider,
        @Inject('ILogger') logger: ILogger,
    ) {
        super(
            commando_client.get_client(),
            {
                name: 'search',
                aliases: ['s'],
                group: CommandGroup.SOUND,
                memberName: 'search',
                description: 'Search for a sound.',
                guildOnly: true,
                examples: ['search kaffee'],
                argsType: 'single',
            },
            logger,
        )

        this.sound_provider = sound_provider

        this.logger.debug('Service instantiated')
    }

    protected async do_run(message: CommandoMessage, term: string): Promise<Message | Message[]> {
        const max_results = 10
        const sounds = this.sound_provider.search(term)

        if (sounds.length === 0) {
            return message.reply('Sorry, that search did not return anything')
        }

        const extra = Math.max(sounds.length - max_results, 0)
        const header = [`Found ${sounds.length} match${sounds.length === 1 ? '' : 'es'}`]
        const and_more = extra > 0 ? [`...and ${extra} more`] : []

        return message.reply(
            [
                ...header,
                ...sounds
                    .sort((a, b) => a.id - b.id)
                    .map(({title, id}) => `${id} - ${title}`)
                    .slice(0, max_results),
                ...and_more,
            ],
            {
                split: true,
            },
        )
    }
}
