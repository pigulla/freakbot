import {Inject} from '@nestjs/common'
import {ArgumentType, CommandoClient} from 'discord.js-commando'

import {CustomArgumentType, ISoundProvider} from '../../domain'

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
        return /^\d+$/.test(value) && this.sound_provider.exists(parseInt(value, 10))
    }

    public parse(value: string): number {
        return parseInt(value, 10)
    }
}
