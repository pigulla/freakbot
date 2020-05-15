import {Module} from '@nestjs/common'

import * as commands from '../application/command'
import * as types from '../application/types'
import {DiscordHandler} from '../handler'
import {CommandoClient} from '../infrastructure'

import {InfrastructureModule} from './infrastructure.module'
import {UtilityModule} from './utility.module'

@Module({
    imports: [UtilityModule, InfrastructureModule],
    controllers: [],
    providers: [
        {
            provide: 'commands',
            useValue: Object.values(commands),
        },
        {
            provide: 'custom-argument-types',
            useValue: Object.values(types),
        },
        {
            provide: 'ICommandoClient',
            useClass: CommandoClient,
        },
        DiscordHandler,
    ],
    exports: [],
})
export class DiscordModule {}
