export enum CommandGroup {
    META = 'meta',
    SOUND = 'sound',
}

export const command_groups: Map<CommandGroup, string> = new Map([
    [CommandGroup.META, 'Meta commands'],
    [CommandGroup.SOUND, 'Sound commands'],
])
