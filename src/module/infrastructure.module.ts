import {Module} from '@nestjs/common'
import {Intents} from 'discord.js'
import {CommandoClient as DiscordCommandoClient} from 'discord.js-commando'

import {SoundProvider} from '../infrastructure'

import {UtilityModule} from './utility.module'

@Module({
    imports: [UtilityModule],
    controllers: [],
    providers: [
        {
            provide: 'client-instance',
            useValue: new DiscordCommandoClient({ws: {intents: Intents.NON_PRIVILEGED}}),
        },
        {
            provide: 'ISoundProvider',
            useClass: SoundProvider,
        },
    ],
    exports: ['client-instance', 'ISoundProvider'],
})
export class InfrastructureModule {}
