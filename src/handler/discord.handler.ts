import {Inject, OnApplicationBootstrap} from '@nestjs/common'

import {ILogger, ICommandoClient, Configuration} from '../domain'

export class DiscordHandler implements OnApplicationBootstrap {
    private readonly commando_client: ICommandoClient
    private readonly logger: ILogger

    public constructor(
        @Inject('Configuration') config: Configuration,
        @Inject('ICommandoClient') commando_client: ICommandoClient,
        @Inject('ILogger') logger: ILogger,
    ) {
        this.commando_client = commando_client
        this.logger = logger.child_for_service(this).set_level(config.log_level.discord_client)
    }

    public onApplicationBootstrap(): void {
        const client = this.commando_client.get_client()

        client.on('debug', message => this.logger.debug(message))
        client.on('warn', message => this.logger.warn(message))
        client.on('error', error => this.logger.error(error.message, error))
        client.on('message', message => this.logger.trace('Message received', {message}))
    }
}
