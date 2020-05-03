import {Inject} from '@nestjs/common'
import {ArgumentType} from 'discord.js-commando'

import {CustomArgumentType, ICommandoClient, ISoundProvider} from '../../domain'

export class SoundType extends ArgumentType {
    private readonly sound_provider: ISoundProvider

    public constructor(
        @Inject('ICommandoClient') commando_client: ICommandoClient,
        @Inject('ISoundProvider') sound_provider: ISoundProvider,
    ) {
        super(commando_client.get_client(), CustomArgumentType.SOUND)

        this.sound_provider = sound_provider
    }

    public validate(value: string) {
        return /^\d+$/.test(value) && this.sound_provider.exists(parseInt(value, 10))
    }

    public parse(value: string): number {
        return parseInt(value, 10)
    }
}
