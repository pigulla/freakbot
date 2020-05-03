import {Inject, Injectable, OnModuleDestroy, OnModuleInit} from '@nestjs/common'
import {ModuleRef} from '@nestjs/core'
import {CommandoClient as DiscordClient, Command, ArgumentType} from 'discord.js-commando'
import {Class} from 'type-fest'

import {FreakbotCommand} from '../application/command/freakbot.abstract-command'
import {ILogger, ICommandoClient, Configuration, command_groups} from '../domain'
import {new_promise} from '../util'

@Injectable()
export class CommandoClient implements OnModuleInit, OnModuleDestroy, ICommandoClient {
    private readonly commando_client: DiscordClient
    private readonly client_token: string
    private readonly logger: ILogger
    private readonly command_classes: Class<Command>[]
    private readonly argument_type_classes: Class<ArgumentType>[]
    private readonly module_ref: ModuleRef

    public constructor(
        @Inject('client-instance') commando_client: DiscordClient,
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

        this.logger.debug('Service instantiated')
    }

    public get_client(): DiscordClient {
        return this.commando_client
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
            this.logger.info('Client is ready')
            resolve()
        })

        await this.commando_client.login(this.client_token)
        await promise

        this.logger.debug('Service initialized')
    }

    public async onModuleDestroy(): Promise<void> {
        this.commando_client.destroy()

        this.logger.debug('Service destroyed')
    }
}
