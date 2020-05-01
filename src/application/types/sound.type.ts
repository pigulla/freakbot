import {Inject} from '@nestjs/common'
import {ArgumentType, CommandoClient} from 'discord.js-commando'

import {CustomArgumentType, ISoundProvider, SoundID} from '../../domain'

export class SoundType extends ArgumentType {
    private readonly sound_provider: ISoundProvider

    public constructor(
        @Inject('CommandoClient') commando_client: CommandoClient,
        @Inject('ISoundProvider') sound_provider: ISoundProvider,
    ) {
        super(commando_client, CustomArgumentType.SOUND)

        this.sound_provider = sound_provider
    }

    public validate(value: string) {
        return this.sound_provider.exists(value as SoundID)
    }

    public parse(value: string): SoundID {
        return value as SoundID
    }
}
