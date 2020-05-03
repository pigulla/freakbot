import {Inject} from '@nestjs/common'
import {Message} from 'discord.js'
import {CommandoMessage, CommandoClient} from 'discord.js-commando'
import {NormalizedPackageJson} from 'read-pkg-up'

import {CommandGroup, ILogger} from '../../domain'

import {FreakbotCommand} from './freakbot-command'

export class VersionCommand extends FreakbotCommand {
    private readonly package_json: NormalizedPackageJson

    public constructor(
        @Inject('CommandoClient') commando_client: CommandoClient,
        @Inject('package.json') package_json: NormalizedPackageJson,
        @Inject('ILogger') logger: ILogger,
    ) {
        super(
            commando_client,
            {
                name: 'version',
                aliases: [],
                group: CommandGroup.META,
                memberName: 'version',
                description: 'Displays the version of the Freakbot.',
            },
            logger,
        )

        this.package_json = package_json

        this.logger.debug('Service instantiated')
    }

    protected async do_run(message: CommandoMessage): Promise<Message | Message[]> {
        return message.reply(`3 x 14 is 38 und 12 das gibt ${this.package_json.version}...`)
    }
}
