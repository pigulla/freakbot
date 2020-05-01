import { forwardRef, Module } from '@nestjs/common';

import { DiscordClient } from '../infrastructure'
import { UtilModule } from './util.module'
import { Discord } from '../application/discord.service';
import { ClientCommandModule } from './client-command.module';

@Module({
    imports: [UtilModule, forwardRef(() => ClientCommandModule)],
    controllers: [],
    providers: [
        {
            provide: 'IDiscordClient',
            useClass: DiscordClient,
        },
        {
            provide: 'IDiscord',
            useClass: Discord,
        },
    ],
    exports: ['IDiscord'],
})
export class DiscordModule {}
