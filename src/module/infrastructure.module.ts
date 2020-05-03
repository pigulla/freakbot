import {Module} from '@nestjs/common'
import {Intents} from 'discord.js'
import {CommandoClient as DiscordCommandoClient} from 'discord.js-commando'

import {Configuration, Sound} from '../domain'
import {parse_lua_data_file, SoundProvider} from '../infrastructure'

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
        {
            provide: 'sound-map',
            inject: ['Configuration'],
            async useFactory(config: Configuration): Promise<Map<number, Sound>> {
                return parse_lua_data_file(config.voicepack_path)
            },
        },
    ],
    exports: ['client-instance', 'ISoundProvider'],
})
export class InfrastructureModule {}
