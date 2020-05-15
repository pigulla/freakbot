import {Test} from '@nestjs/testing'
import {TestingModule} from '@nestjs/testing/testing-module'
import {expect} from 'chai'
import {CommandoClient as DiscordCommandoClient} from 'discord.js-commando'
import sinon, {SinonStubbedInstance} from 'sinon'
import {Class} from 'type-fest'

import {FreakbotCommand} from '~src/application/command/freakbot.abstract-command'
import * as types from '~src/application/types'
import {Configuration, ILogger, ISoundProvider} from '~src/domain'
import {CommandoClient} from '~src/infrastructure'

import {mock_configuration, mock_logger, mock_sound_provider} from '~mock'

const {stub, match} = sinon

export interface CommandComponentTestSetup<T extends FreakbotCommand> {
    module: TestingModule
    command: T
}

export async function setup_command_component_test<T extends FreakbotCommand<any>>(
    // eslint-disable-next-line @typescript-eslint/naming-convention
    Command: Class<T>,
): Promise<CommandComponentTestSetup<T>> {
    const config_mock: SinonStubbedInstance<Configuration> = mock_configuration()
    const discord_client: DiscordCommandoClient = new DiscordCommandoClient()
    const logger_mock: SinonStubbedInstance<ILogger> = mock_logger()
    const sound_provider_mock: SinonStubbedInstance<ISoundProvider> = mock_sound_provider()

    const module = await Test.createTestingModule({
        providers: [
            {
                provide: 'ISoundProvider',
                useValue: sound_provider_mock,
            },
            {
                provide: 'ILogger',
                useValue: logger_mock,
            },
            {
                provide: 'Configuration',
                useValue: config_mock,
            },
            {
                provide: 'custom-argument-types',
                useValue: Object.values(types),
            },
            {
                provide: 'commands',
                useValue: [Command],
            },
            {
                provide: 'client-instance',
                useValue: discord_client,
            },
            {
                provide: 'ICommandoClient',
                useClass: CommandoClient,
            },
        ],
    }).compile()

    const client = module.get<CommandoClient>('ICommandoClient')
    const command_client = client.get_client()

    stub(command_client, 'on').withArgs(match.same('ready'), match.func).yields()
    stub(command_client, 'login').withArgs(config_mock.discord_client_token).resolves()
    stub(command_client, 'voice').get(() => ({
        connections: {
            array() {
                return [
                    {
                        channel: {
                            members: [],
                        },
                    },
                ]
            },
        },
    }))

    await client.onModuleInit()

    const command = client.get_client().registry.commands.last() as T
    expect(command).to.be.instanceOf(Command)

    return {module, command}
}
