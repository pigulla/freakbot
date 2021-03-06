import {Inject} from '@nestjs/common'
import {Message} from 'discord.js'
import {CommandoMessage} from 'discord.js-commando'
import {NormalizedPackageJson} from 'read-pkg-up'

import {CommandGroup, ICommandoClient, ILogger} from '../../domain'

import {FreakbotCommand} from './freakbot.abstract-command'

export class VersionCommand extends FreakbotCommand {
    private readonly package_json: NormalizedPackageJson

    public constructor(
        @Inject('ICommandoClient') commando_client: ICommandoClient,
        @Inject('package.json') package_json: NormalizedPackageJson,
        @Inject('ILogger') logger: ILogger,
    ) {
        super(
            commando_client.get_client(),
            {
                name: 'version',
                aliases: ['v'],
                group: CommandGroup.META,
                memberName: 'version',
                description: 'Display the version of the Freakbot.',
            },
            logger,
        )

        this.package_json = package_json

        this.logger.debug('Service instantiated')
    }

    protected async do_run(message: CommandoMessage): Promise<Message | Message[]> {
        return message.reply(`Freakbot is at version ${this.package_json.version}`)
    }
}
