import { Inject } from '@nestjs/common'

import { AbstractCommand, ILogger, ISoundProvider, SoundID } from '../../domain';
import { IDiscord } from '../../domain/discord.interface';

export class PlayCommand extends AbstractCommand {
    private sound_provider: ISoundProvider
    
    private discord: IDiscord
    
    public constructor(
        @Inject('IDiscord') discord: IDiscord,
        @Inject('ISoundProvider') sound_provider: ISoundProvider,
        @Inject('ILogger') logger: ILogger,
    ) {
        super(logger)

        this.discord = discord
        this.sound_provider = sound_provider
        
        this.logger.info('Command handler instantiated')
    }
    
    public async handle(argv: string[]): Promise<string | null> {
        if (argv.length < 1) {
            return 'Ja watt denn?'
        }
        
        const sound_id = argv[0] as SoundID
        if (!this.sound_provider.exists(sound_id)) {
            return 'Jibbet nich...'
        }

        await this.discord.play(sound_id)
        return null
    }
}
