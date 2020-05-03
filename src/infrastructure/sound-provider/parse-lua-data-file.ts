import {promises as fs} from 'fs'
import {join} from 'path'

import {Sound} from '../../domain'

const regex = /^\s*database\[(\d+)\]\s*=\s*"([^"]+)";$/

// There's got to be a proper way to do this, but Unicode is a PITA and I honestly don't care all
// that much ;)
const char_map = new Map<string, string>([
    ['\\195\\132', 'Ä'],
    ['\\195\\150', 'Ö'],
    ['\\195\\156', 'Ü'],
    ['\\195\\159', 'ß'],
    ['\\195\\161', 'à'],
    ['\\195\\164', 'ä'],
    ['\\195\\177', 'ñ'],
    ['\\195\\182', 'ö'],
    ['\\195\\188', 'ü'],
])

// ...and by "parsing" I mean regex'ing stuff :)
export async function parse_lua_data_file(
    voicepack_directory: string,
): Promise<Map<number, Sound>> {
    const data_file = join(voicepack_directory, 'Data.lua')
    const buffer = await fs.readFile(data_file)

    /* eslint-disable @typescript-eslint/no-non-null-assertion */
    return buffer
        .toString()
        .split(/\n/)
        .map(line => regex.exec(line))
        .filter(maybe_matches => maybe_matches !== null)
        .map(matches => ({
            id: parseInt(matches![1], 10),
            title: matches![2].replace(/(\\\d{3}\\\d{3})/g, match => char_map.get(match) || match),
            filename: join(voicepack_directory, 'sounds', `fff${matches![1].padStart(3, '0')}.mp3`),
        }))
        .reduce((map, sound) => map.set(sound.id, sound), new Map<number, Sound>())
}
