import {Module} from '@nestjs/common'

import * as commands from '../application/command'
import * as types from '../application/types'
import {DiscordClient} from '../infrastructure'

import {InfrastructureModule} from './infrastructure.module'
import {UtilModule} from './util.module'

@Module({
    imports: [UtilModule, InfrastructureModule],
    controllers: [],
    providers: [
        {
            provide: 'Commands',
            useValue: Object.values(commands),
        },
        {
            provide: 'CustomArgumentTypes',
            useValue: Object.values(types),
        },
        DiscordClient,
    ],
    exports: [],
})
export class DiscordModule {}
