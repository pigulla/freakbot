import { Inject, OnModuleInit } from '@nestjs/common'
import { ILogger } from '../../domain'
import read_pkg_up from 'read-pkg-up'
import semver, { SemVer } from 'semver'

import { AbstractCommand } from '../../domain'

export class VersionCommand extends AbstractCommand implements OnModuleInit {
    private version: SemVer | null

    public constructor(@Inject('ILogger') logger: ILogger) {
        super(logger)

        this.version = null
        this.logger.info('Command handler instantiated')
    }

    public async onModuleInit(): Promise<void> {
        const pkg = await read_pkg_up()

        if (!pkg) {
            throw new Error('Failed to read package.json')
        }
        
        const version = semver.parse(pkg.packageJson.version)

        if (!version) {
            throw new Error('Failed to parse package version')
        }
        
        this.version = version
    }
    
    public async handle(_argv: string[]): Promise<string | null> {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return `3 x 14 is 38 und 12 das gibt ${this.version!.format()}`
    }
}
