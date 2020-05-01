import ExtendableError from 'ts-error'
import {Opaque} from 'type-fest'

export type SoundID = Opaque<string, 'SoundID'>

export interface Sound {
    id: SoundID
    title: string
    filename: string
}

export interface ISoundProvider {
    list(): Sound[]
    search(term: string): Sound[]
    exists(id: SoundID): boolean
    get(id: SoundID): Sound
}

export class SoundNotFoundError extends ExtendableError {}
