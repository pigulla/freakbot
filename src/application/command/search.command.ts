import {Inject} from '@nestjs/common'
import {Message} from 'discord.js'
import {CommandoMessage, CommandoClient, FriendlyError} from 'discord.js-commando'

import {CommandGroup, ILogger, ISoundProvider} from '../../domain'

import {AbstractCommand} from './abstract-command'

export class SearchCommand extends AbstractCommand<string> {
    private readonly sound_provider: ISoundProvider

    public constructor(
        @Inject('CommandoClient') commando_client: CommandoClient,
        @Inject('ISoundProvider') sound_provider: ISoundProvider,
        @Inject('ILogger') logger: ILogger,
    ) {
        super(
            commando_client,
            {
                name: 'search',
                aliases: [],
                group: CommandGroup.SOUND,
                memberName: 'search',
                description: 'Searches for a sound.',
                guildOnly: true,
                examples: ['search kaffee'],
                argsType: 'single',
            },
            logger,
        )

        this.sound_provider = sound_provider

        this.logger.debug('Service instantiated')
    }

    protected async do_run(msg: CommandoMessage, term: string): Promise<Message | Message[]> {
        const MAX = 10

        if (term.trim().length < 3) {
            throw new FriendlyError('Please enter at least three characters')
        }

        const sounds = this.sound_provider.search(term)

        if (sounds.length === 0) {
            return msg.reply('Sorry, that search did not return anything')
        }

        const extra = Math.max(sounds.length - MAX, 0)
        const header = [`Found ${sounds.length} match${sounds.length === 1 ? '' : 'es'}`]
        const and_more = extra > 0 ? [`...and ${extra} more`] : []

        return msg.reply(
            [
                ...header,
                ...sounds
                    .sort((a, b) => a.id.localeCompare(b.id))
                    .map(({title, id}) => `${id} - ${title}`)
                    .slice(0, MAX),
                ...and_more,
            ],
            {
                split: true,
            },
        )
    }
}
