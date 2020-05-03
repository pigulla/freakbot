import {join} from 'path'

import {Inject, OnModuleInit} from '@nestjs/common'

import {ISoundProvider, Sound, SoundNotFoundError, ILogger, Configuration} from '../domain'

import {parse_lua_data_file} from './parse-lua-data-file'

export class SoundProvider implements ISoundProvider, OnModuleInit {
    private readonly logger: ILogger
    private readonly sounds_directory: string
    private readonly data_file: string
    private readonly map: Map<number, Sound>

    public constructor(
        @Inject('Configuration') config: Configuration,
        @Inject('ILogger') logger: ILogger,
    ) {
        this.sounds_directory = join(config.voicepack_path, 'sounds')
        this.data_file = join(config.voicepack_path, 'Data.lua')

        this.logger = logger.child_for_service(this)
        this.map = new Map()

        this.logger.debug('Service instantiated')
    }

    public async onModuleInit(): Promise<void> {
        const sound_map = await parse_lua_data_file(this.data_file)
        this.map.clear()

        for (const [id, title] of sound_map) {
            this.map.set(id, {
                id,
                title,
                filename: join(this.sounds_directory, `fff${String(id).padStart(3, '0')}.mp3`),
            })
        }

        this.logger.debug('Service initialized')
    }

    public get size(): number {
        return this.map.size
    }

    public search(term: string): Sound[] {
        const s = term.trim().toLowerCase()

        return [...this.map.values()].filter(sound => sound.title.toLowerCase().includes(s))
    }

    public exists(id: number): boolean {
        return this.map.has(id)
    }

    public list(): Sound[] {
        return [...this.map.values()]
    }

    public get(id: number): Sound {
        const sound = this.map.get(id)

        if (!sound) {
            throw new SoundNotFoundError()
        }

        return sound
    }
}
