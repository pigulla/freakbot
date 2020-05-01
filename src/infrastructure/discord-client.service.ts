import { Inject, Injectable, OnModuleInit } from '@nestjs/common'
import Discord, { Intents, Message } from 'discord.js';
import { new_promise } from '../util'
import { ILogger, Configuration, IDispatcher } from '../domain';
import { IDiscordClient } from './discord-client.interface'
import { parse_client_command, UnparsableCommandError } from '../application';

@Injectable()
export class DiscordClient implements IDiscordClient, OnModuleInit {
    private readonly client: Discord.Client

    private readonly dispatcher: IDispatcher

    private readonly client_token: string

    private readonly logger: ILogger

    public constructor(
        @Inject('IDispatcher') dispatcher: IDispatcher,
        @Inject('Configuration') config: Configuration,
        @Inject('ILogger') logger: ILogger)
    {
        this.dispatcher = dispatcher
        this.logger = logger.child_for_service(DiscordClient.name)
        this.client = new Discord.Client({ ws: { intents: Intents.NON_PRIVILEGED } })
        this.client_token = config.discord_client_token

        const discord_logger = this.logger.child({ subsystem: 'discord ' }).set_level(config.log_level.discord_client)
        this.register_event_listeners(discord_logger)

        this.logger.info('Service instantiated')
    }

    public async onModuleInit(): Promise<void> {
        const { promise, resolve } = new_promise<void>()

        this.client.on('ready', () => {
            this.logger.info('Connected')
            resolve()
        })
        this.client.login(this.client_token)

        await promise
        this.logger.info('Service initialized')
    }
    
    public async setActivity(activity: string): Promise<void> {
        await this.client.user?.setActivity(activity)
    }
    
    private register_event_listeners(discord_logger: ILogger): void {
        this.client.on('debug', message => discord_logger.debug(message))
        this.client.on('warn', message => discord_logger.warn(message))
        this.client.on('error', error => discord_logger.error('Error', error))
        this.client.on('message', (message) => {
            discord_logger.trace('Message received', { message })
            
            if (this.client.user?.id !== message.author.id) {
                this.on_message(message)
            }
        })
    }
    
    private async on_message(message: Message): Promise<void> {
        let command, reply

        try {
            command = parse_client_command(message)
        } catch (error) {
            if (error instanceof UnparsableCommandError) {
                this.logger.info('Unparsable command')
                await message.reply("Schwätz' deutlich, Junge!")
            } else {
                this.logger.warn('Command parser threw an unexpected exception', { error })
                await message.reply('Kabbudd :(')
            }
            
            return
        }
        
        try {
            reply = await this.dispatcher.dispatch(command)
        } catch (error) {
            this.logger.error(`Error during command execution: ${error.message}`, { command })
            await message.reply('Kagge, da is was schiefgelaufen :(')
            return
        }
        
        await message.reply(reply)
    }
}
