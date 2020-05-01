import { VoiceChannel } from 'discord.js';

import { SoundID } from './sound-provider.interface';

export interface IDiscord {
    join_voice_channel(channel: VoiceChannel): Promise<void>

    play(sound_id: SoundID): Promise<void>
}
