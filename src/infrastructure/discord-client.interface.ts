export interface IDiscordClient {
    set_activity(activity: string): Promise<void>
}
