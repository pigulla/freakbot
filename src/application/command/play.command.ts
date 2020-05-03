import {Inject} from '@nestjs/common'
import {Message} from 'discord.js'
import {CommandoMessage} from 'discord.js-commando'

import {
    CommandGroup,
    CustomArgumentType,
    ICommandoClient,
    ILogger,
    ISoundProvider,
} from '../../domain'

import {FreakbotSoundCommand} from './freakbot.sound-command'

type Args = {
    sound_id: number
}

export class PlayCommand extends FreakbotSoundCommand<Args> {
    public constructor(
        @Inject('ICommandoClient') commando_client: ICommandoClient,
        @Inject('ISoundProvider') sound_provider: ISoundProvider,
        @Inject('ILogger') logger: ILogger,
    ) {
        super(
            commando_client.get_client(),
            {
                name: 'play',
                aliases: ['p'],
                group: CommandGroup.SOUND,
                memberName: 'play',
                description: 'Play a sound.',
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
            sound_provider,
            logger,
        )

        this.logger.debug('Service instantiated')
    }

    protected async do_run(message: CommandoMessage, args: Args): Promise<Message | Message[]> {
        const sound = this.sound_provider.get(args.sound_id)

        await this.play_sound(message.author, sound)
        return message.reply(sound.title)
    }
}
