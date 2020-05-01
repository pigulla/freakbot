import {Module} from '@nestjs/common'
import {Intents} from 'discord.js'
import {CommandoClient} from 'discord.js-commando'

import {SoundProvider} from '../infrastructure'

import {UtilModule} from './util.module'

@Module({
    imports: [UtilModule],
    controllers: [],
    providers: [
        {
            provide: 'CommandoClient',
            useValue: new CommandoClient({ws: {intents: Intents.NON_PRIVILEGED}}),
        },
        {
            provide: 'ISoundProvider',
            useClass: SoundProvider,
        },
    ],
    exports: ['CommandoClient', 'ISoundProvider'],
})
export class InfrastructureModule {}
