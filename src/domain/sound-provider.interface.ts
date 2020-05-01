import { Opaque } from 'type-fest'
import ExtendableError from 'ts-error';

export type SoundID = Opaque<string, 'SoundID'>

export interface Sound {
    id: SoundID
    title: string
    filename: string
}

export interface ISoundProvider {
    list(): Sound[]
    exists(id: SoundID): boolean
    get(id: SoundID): Sound
}

export class SoundNotFoundError extends ExtendableError {}
