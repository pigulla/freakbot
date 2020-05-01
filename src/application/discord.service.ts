import { IDiscord } from '../domain/discord.interface';
import { Inject } from '@nestjs/common';
import { ILogger, ISoundProvider, SoundID } from '../domain';
import { VoiceChannel, VoiceConnection } from 'discord.js';
import ExtendableError from 'ts-error';
import { new_promise } from '../util';
import { IDiscordClient } from '../infrastructure';

export class InvalidStateError extends ExtendableError {} 

export class Discord implements IDiscord {
    private readonly logger: ILogger
    
    private readonly sound_provider: ISoundProvider
    
    private readonly discord_client: IDiscordClient
    
    private voice_connection: VoiceConnection | null
    
    public constructor(
        @Inject('IDiscordClient') discord_client: IDiscordClient,
        @Inject('ISoundProvider') sound_provider: ISoundProvider,
        @Inject('ILogger') logger: ILogger,
    ) {
        this.discord_client = discord_client
        this.sound_provider = sound_provider
        this.logger = logger.child_for_service(Discord.name)
        this.voice_connection = null
        
        this.logger.info('Service instantiated')
    }

    public async join_voice_channel(channel: VoiceChannel): Promise<void> {
        if (this.voice_connection) {
            throw new InvalidStateError('Already connected to a voice channel')
        }
        
        this.voice_connection = await channel.join()
        await this.discord_client.setActivity(`Nervt grad alle in ${channel.name}`)
    }
    
    public async play(sound_id: SoundID): Promise<void> {
        if (!this.voice_connection) {
            throw new InvalidStateError('Not connected to a voice channel')
        }

        const sound = this.sound_provider.get(sound_id)
        const {promise, reject, resolve} = new_promise<void>()
        const stream_dispatcher = this.voice_connection.play(sound.filename)
        
        function on_close() {
            // eslint-disable-next-line @typescript-eslint/no-use-before-define
            stream_dispatcher.off('error', on_error)
            resolve()
        }
        
        function on_error (error: Error) {
            stream_dispatcher.off('close', on_close)
            reject(error)
        }
        
        stream_dispatcher.once('error', on_error)
        stream_dispatcher.once('close', on_close)
        
        return promise
    } 
}
