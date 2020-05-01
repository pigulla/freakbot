export interface IDiscordClient {
    setActivity(activity: string): Promise<void>
}
