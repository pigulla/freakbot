import { Message } from "discord.js";

export interface ClientCommand {
    command: string
    argv: string[]
    message: Message
}
