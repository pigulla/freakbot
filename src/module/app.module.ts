import {Module} from '@nestjs/common'

import {StatusController} from '../handler/controller'

import {DiscordModule} from './discord.module'
import {UtilityModule} from './utility.module'

@Module({
    imports: [DiscordModule, UtilityModule],
    controllers: [StatusController],
    providers: [],
})
export class AppModule {}
