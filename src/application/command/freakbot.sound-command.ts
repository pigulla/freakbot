import {User, VoiceConnection} from 'discord.js'
import {CommandoClient, CommandInfo, FriendlyError} from 'discord.js-commando'

import {ILogger, ISoundProvider, Sound} from '../../domain'

import {FreakbotCommand} from './freakbot.abstract-command'

export abstract class FreakbotSoundCommand<T = void> extends FreakbotCommand<T> {
    protected readonly sound_provider: ISoundProvider

    protected constructor(
        commando_client: CommandoClient,
        command_info: CommandInfo,
        sound_provider: ISoundProvider,
        logger: ILogger,
    ) {
        super(commando_client, command_info, logger)

        this.sound_provider = sound_provider
    }

    protected async play_sound(author: User, sound: Sound): Promise<void> {
        const voice_connection = await this.get_voice_connection()

        await this.assert_user_is_in_voice_channel(author, voice_connection)
        await voice_connection.play(sound.filename)
    }

    protected async assert_user_is_in_voice_channel(
        user: User,
        voice_connection: VoiceConnection,
    ): Promise<void> {
        const is_in_channel = voice_connection.channel.members.some(member => member.user === user)

        if (!is_in_channel) {
            throw new FriendlyError(
                'You must be in the same voice channel as the Freakbot to use this command.',
            )
        }
    }

    public get_voice_connection(): VoiceConnection {
        const voice_connections = this.client.voice?.connections.array()

        if (!voice_connections || voice_connections.length === 0) {
            throw new FriendlyError('You must invite the bot to a voice channel first')
        }

        return voice_connections[0]
    }
}
