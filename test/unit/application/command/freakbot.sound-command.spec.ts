import {Inject} from '@nestjs/common'
import {expect} from 'chai'
import {Message} from 'discord.js'
import {CommandInfo, CommandoMessage, FriendlyError} from 'discord.js-commando'

import {FreakbotSoundCommand} from '~src/application/command/freakbot.sound-command'
import {ICommandoClient, ILogger, ISoundProvider} from '~src/domain'

import {get_command_instance} from './get-command-instance'

class SoundCommand extends FreakbotSoundCommand {
    public constructor(
        @Inject('ICommandoClient') commando_client: ICommandoClient,
        @Inject('ISoundProvider') sound_provider: ISoundProvider,
        @Inject('ILogger') logger: ILogger,
    ) {
        super(commando_client.get_client(), {} as CommandInfo, sound_provider, logger)
    }

    protected async do_run(_message: CommandoMessage): Promise<Message | Message[]> {
        return []
    }
}

jest.mock('discord.js-commando/src/commands/base', function () {
    return class BaseClassMock {
        protected client = {
            voice: {
                connections: {
                    array() {
                        return []
                    },
                },
            },
        }
    }
})

describe('The play command', function () {
    it('should do things', async function () {
        const {command} = await get_command_instance<SoundCommand>(SoundCommand)

        expect(() => command.get_voice_connection()).to.throw(
            FriendlyError,
            'You must invite the bot to a voice channel first',
        )
    })
})
