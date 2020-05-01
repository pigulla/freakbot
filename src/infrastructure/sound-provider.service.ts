import { basename, join } from 'path'
import { promises as fs } from 'fs'
import { Inject, OnModuleInit } from '@nestjs/common';

import { ISoundProvider, Sound, SoundID, SoundNotFoundError, ILogger, Configuration } from '../domain';

export class SoundProvider implements ISoundProvider, OnModuleInit {
    private readonly logger: ILogger
    private readonly directory: string
    private readonly map: Map<SoundID, Sound>

    public constructor(
        @Inject('Configuration') config: Configuration,
        @Inject('ILogger') logger: ILogger,
    ) {
        this.directory = config.sound_files_path
        this.logger = logger.child_for_service(SoundProvider.name)
        this.map = new Map()
        
        this.logger.info('Service instantiated')
    }

    public async onModuleInit(): Promise<void> {
        const index_file = join(this.directory, 'index.json')
        const buffer = await fs.readFile(index_file)
        const object: { [filename: string]: string } = JSON.parse(buffer.toString())

        this.map.clear()

        Object.entries(object)
            .map(([filename, title]) => ({ filename, title, id: basename(filename) as SoundID }))
            .forEach(({ filename, title, id }) => this.map.set(id, { title, filename, id }))

        this.logger.info('Service initialized')
    }

    public exists(id: SoundID): boolean {
        return this.map.has(id)
    }

    public list(): Sound[] {
        return [...this.map.values()]
    }

    public get(id: SoundID): Sound {
        const sound = this.map.get(id)

        if (!sound) {
            throw new SoundNotFoundError()
        }

        return sound
    }
}
