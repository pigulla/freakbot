import { Message } from 'discord.js';
import string_argv from 'string-argv'
import ExtendableError from 'ts-error'

import { ClientCommand } from '../domain';


const command_regex = /^!([a-zA-Z]+)\b(.*)/

export class UnparsableCommandError extends ExtendableError {}

export function parse_client_command(message: Message): ClientCommand {
    const matches = command_regex.exec(message.content)

    if (!matches) {
        throw new UnparsableCommandError()
    }

    const [, command, args] = matches;
    const argv = string_argv(args)

    return {
        command,
        argv,
        message,
    }
}
