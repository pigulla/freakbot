import {Inject} from '@nestjs/common'

import {ISoundProvider, Sound, SoundNotFoundError, ILogger} from '../../domain'

export class SoundProvider implements ISoundProvider {
    private readonly logger: ILogger
    private readonly map: Map<number, Sound>

    public constructor(
        @Inject('sound-map') sound_map: Map<number, Sound>,
        @Inject('ILogger') logger: ILogger,
    ) {
        this.map = sound_map
        this.logger = logger.child_for_service(this)

        this.logger.debug('Service instantiated')
    }

    public size(): number {
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
