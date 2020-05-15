import ExtendableError from 'ts-error'

export interface Sound {
    id: number
    title: string
    filename: string
}

export interface ISoundProvider {
    size(): number
    list(): Sound[]
    search(term: string): Sound[]
    exists(id: number): boolean
    get(id: number): Sound
}

export class SoundNotFoundError extends ExtendableError {}
