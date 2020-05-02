import {Inject} from '@nestjs/common'
import {Message} from 'discord.js'
import {CommandoMessage, CommandoClient} from 'discord.js-commando'

import {CommandGroup, CustomArgumentType, ILogger, ISoundProvider, SoundID} from '../../domain'

import {FreakbotCommand} from './freakbot-command'

type Args = {
    sound_id: SoundID
}

export class PlayCommand extends FreakbotCommand<Args> {
    private readonly sound_provider: ISoundProvider

    public constructor(
        @Inject('CommandoClient') commando_client: CommandoClient,
        @Inject('ISoundProvider') sound_provider: ISoundProvider,
        @Inject('ILogger') logger: ILogger,
    ) {
        super(
            commando_client,
            {
                name: 'play',
                aliases: [],
                group: CommandGroup.SOUND,
                memberName: 'play',
                description: 'Plays a sound.',
                guildOnly: true,
                examples: ['play fff101_01.mp3'],
                args: [
                    {
                        key: 'sound_id',
                        label: 'Sound ID',
                        prompt: 'The sound id.',
                        type: CustomArgumentType.SOUND,
                    },
                ],
            },
            logger,
        )

        this.sound_provider = sound_provider

        this.logger.debug('Service instantiated')
    }

    protected async do_run(msg: CommandoMessage, args: Args): Promise<Message | Message[]> {
        const sound = this.sound_provider.get(args.sound_id)

        await this.get_voice_connection().play(sound.filename)
        return msg.reply(sound.title)
    }
}
