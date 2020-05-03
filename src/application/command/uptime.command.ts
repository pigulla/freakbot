import {Inject} from '@nestjs/common'
import {Message} from 'discord.js'
import {CommandoMessage} from 'discord.js-commando'

import {CommandGroup, ICommandoClient, ILogger} from '../../domain'
import {IUptime} from '../../domain/uptime.interface'

import {FreakbotCommand} from './freakbot.abstract-command'

export class UptimeCommand extends FreakbotCommand {
    private readonly uptime: IUptime

    public constructor(
        @Inject('ICommandoClient') commando_client: ICommandoClient,
        @Inject('IUptime') uptime: IUptime,
        @Inject('ILogger') logger: ILogger,
    ) {
        super(
            commando_client.get_client(),
            {
                name: 'uptime',
                aliases: ['up'],
                group: CommandGroup.META,
                memberName: 'uptime',
                description: 'Show for how long the Freakbot has been running.',
            },
            logger,
        )

        this.uptime = uptime

        this.logger.debug('Service instantiated')
    }

    protected async do_run(message: CommandoMessage): Promise<Message | Message[]> {
        return message.reply(this.uptime.get_uptime().humanize(false))
    }
}
