// ...and by "parsing" I mean regex'ing stuff :)
import {promises as fs} from 'fs'

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

export async function parse_lua_data_file(path: string): Promise<Map<number, string>> {
    const buffer = await fs.readFile(path)

    /* eslint-disable @typescript-eslint/no-non-null-assertion */
    return buffer
        .toString()
        .split(/\n/)
        .map(line => regex.exec(line))
        .filter(maybe_matches => maybe_matches !== null)
        .reduce(
            (map, matches) =>
                map.set(
                    parseInt(matches![1], 10),
                    matches![2].replace(/(\\\d{3}\\\d{3})/g, match => char_map.get(match) || match),
                ),
            new Map(),
        )
}
