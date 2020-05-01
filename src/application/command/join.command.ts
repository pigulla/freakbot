import { Inject } from '@nestjs/common';
import { Message } from 'discord.js';

import { AbstractCommand, ILogger } from '../../domain';
import { IDiscord } from '../../domain/discord.interface';

export class JoinCommand extends AbstractCommand {
    private readonly discord: IDiscord
    
    public constructor(
        @Inject('IDiscord') discord: IDiscord,
        @Inject('ILogger') logger: ILogger,
    ) {
        super(logger)

        this.discord = discord
        
        this.logger.info('Command handler instantiated')
    }
    
    public async handle(_argv: string[], message: Message): Promise<string | null> {
        const { guild, member } = message

        if (!guild) {
            return 'Das geht nur vom Kontrollraum aus, echt jetzt.'
        }

        if (!member) {
            return 'Watt, wer bist du denn?'
        }
        
        const voice_channel = member.voice.channel
        
        if (!voice_channel) {
            return 'Geh erstmal in einen Sprachkanal, dann sehen wir weiter.'
        }
        
        await this.discord.join_voice_channel(voice_channel)
        return `Affirmative! Ab nach ${voice_channel.name}.`
    }
}
