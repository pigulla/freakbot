import { Inject } from '@nestjs/common';

import { ClientCommand, CommandHandlerMap, IDispatcher, ILogger } from '../domain';

export class Dispatcher implements IDispatcher {
    private readonly handlers: CommandHandlerMap = new Map();

    private readonly logger: ILogger;

    public constructor (
        @Inject('CommandHandlers') handlers: CommandHandlerMap,
        @Inject('ILogger') logger: ILogger,
    ) {
        this.handlers = handlers;
        this.logger = logger.child_for_service(Dispatcher.name);
    }

    public async dispatch (client_command: ClientCommand): Promise<void> {
        const { command, argv, message } = client_command;
        const handler = this.handlers.get(command);

        if (!handler) {
            this.logger.debug(`Unknown command: "${command}"`);
            await message.reply('Hmm, hmm... Was? Äh, jaja!');
            return;
        }

        this.logger.debug('Dispatching command', { command, argv });
        const reply = await handler.handle(argv, message);

        if (reply) {
            await message.channel.send(reply);
        }
    }
}
