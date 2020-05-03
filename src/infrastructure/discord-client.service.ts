import {Inject, Injectable, OnModuleInit} from '@nestjs/common'
import {ModuleRef} from '@nestjs/core'
import {CommandoClient, Command, ArgumentType} from 'discord.js-commando'
import {Class} from 'type-fest'

import {FreakbotCommand} from '../application/command/freakbot-command'
import {ILogger, Configuration, command_groups} from '../domain'
import {new_promise} from '../util'

@Injectable()
export class DiscordClient implements OnModuleInit {
    private readonly commando_client: CommandoClient
    private readonly client_token: string
    private readonly logger: ILogger
    private readonly command_classes: Class<Command>[]
    private readonly argument_type_classes: Class<ArgumentType>[]
    private readonly module_ref: ModuleRef

    public constructor(
        @Inject('CommandoClient') commando_client: CommandoClient,
        @Inject('Commands') command_classes: Class<FreakbotCommand<any>>[],
        @Inject('CustomArgumentTypes') argument_type_classes: Class<ArgumentType>[],
        @Inject('Configuration') config: Configuration,
        @Inject('ILogger') logger: ILogger,
        module_ref: ModuleRef,
    ) {
        this.logger = logger.child_for_service(this)
        this.commando_client = commando_client
        this.client_token = config.discord_client_token
        this.command_classes = command_classes
        this.argument_type_classes = argument_type_classes
        this.module_ref = module_ref

        const discord_logger = this.logger
            .child({subsystem: 'discord '})
            .set_level(config.log_level.discord_client)

        this.register_event_listeners(discord_logger)

        this.logger.info('Service instantiated')
    }

    private async create<T>(classes: Class<T>[]): Promise<T[]> {
        return Promise.all(classes.map(clazz => this.module_ref.create(clazz)))
    }

    public async onModuleInit(): Promise<void> {
        const {argument_type_classes, command_classes} = this
        const {promise, resolve} = new_promise<void>()

        this.commando_client.registry.registerDefaults()
        this.commando_client.registry.registerGroups([...command_groups.entries()])
        this.commando_client.registry.registerTypes(await this.create(argument_type_classes))
        this.commando_client.registry.registerCommands(await this.create(command_classes))

        this.commando_client.on('ready', () => {
            this.logger.info('Connected')
            resolve()
        })

        this.commando_client.login(this.client_token)
        await promise

        this.logger.info('Service initialized')
    }

    private register_event_listeners(discord_logger: ILogger): void {
        this.commando_client.on('debug', message => discord_logger.debug(message))
        this.commando_client.on('warn', message => discord_logger.warn(message))
        this.commando_client.on('error', error => discord_logger.error('Error', error))
        this.commando_client.on('message', message =>
            discord_logger.trace('Message received', {message}),
        )
    }
}
