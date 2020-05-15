import {Test} from '@nestjs/testing'
import {SinonStubbedInstance} from 'sinon'
import {Class} from 'type-fest'

import {FreakbotCommand} from '~src/application/command/freakbot.abstract-command'
import {ICommandoClient, ILogger, ISoundProvider} from '~src/domain'

import {mock_commando_client, mock_logger, mock_sound_provider} from '~mock'

export interface Mocks<T extends FreakbotCommand<any>> {
    command: T
    commando_client: SinonStubbedInstance<ICommandoClient>
    sound_provider: SinonStubbedInstance<ISoundProvider>
    logger: SinonStubbedInstance<ILogger>
}

export async function get_command_instance<T extends FreakbotCommand<any>>(
    // eslint-disable-next-line @typescript-eslint/naming-convention
    Command: Class<T>,
): Promise<Mocks<T>> {
    const logger_mock: SinonStubbedInstance<ILogger> = mock_logger()
    const sound_provider_mock: SinonStubbedInstance<ISoundProvider> = mock_sound_provider()
    const commando_client_mock: SinonStubbedInstance<ICommandoClient> = mock_commando_client()

    const module = await Test.createTestingModule({
        providers: [
            Command,
            {
                provide: 'ISoundProvider',
                useValue: sound_provider_mock,
            },
            {
                provide: 'ILogger',
                useValue: logger_mock,
            },
            {
                provide: 'ICommandoClient',
                useValue: commando_client_mock,
            },
        ],
    }).compile()

    return {
        command: module.get<T>(Command),
        commando_client: module.get('ICommandoClient'),
        sound_provider: module.get('ISoundProvider'),
        logger: module.get('ILogger'),
    }
}
