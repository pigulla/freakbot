import { Message } from 'discord.js';

import { ILogger } from './logger.interface'

export abstract class AbstractCommand {
    protected readonly logger: ILogger

    public constructor(logger: ILogger) {
        this.logger = logger.child_for_command_handler(this.get_class_name())
        
        this.logger.trace('Instantiating command handler')
    }

    protected get_class_name(): string {
        const prototype = Object.getPrototypeOf(this)

        return prototype.constructor.name
    }

    public get_command_name(): string {
        const name = this.get_class_name()
        const matches = /^([A-Z](?:[a-z])+)Command$/.exec(name)

        if (!matches) {
            throw new Error(`Failed to infer command name from class name "${name}"`)
        }

        return matches[1].toLowerCase()
    }
    
    public abstract handle(parameters: string[], message: Message): Promise<string | null>;
}
