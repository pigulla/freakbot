import {Controller, Inject, Get} from '@nestjs/common'
import {NormalizedPackageJson} from 'read-pkg-up'
import simplegit, {SimpleGit} from 'simple-git/promise'

import {Configuration, ILogger} from '../../domain'

export type StatusDTO = {
    application_version: string
    voicepack_revision: string | null
}

@Controller()
export class StatusController {
    private readonly logger: ILogger
    private readonly package_json: NormalizedPackageJson
    private readonly git: SimpleGit

    public constructor(
        @Inject('ILogger') logger: ILogger,
        @Inject('Configuration') config: Configuration,
        @Inject('package.json') package_json: NormalizedPackageJson,
    ) {
        this.logger = logger.child_for_controller(this)
        this.package_json = package_json
        this.git = simplegit(config.voicepack_path)

        this.logger.info('Controller instantiated')
    }

    @Get('/status')
    public async get_status(): Promise<StatusDTO> {
        return {
            application_version: this.package_json.version,
            voicepack_revision: await this.get_voicepack_revision(),
        }
    }

    private async get_voicepack_revision(): Promise<string | null> {
        if (await this.git.checkIsRepo()) {
            return this.git.revparse(['HEAD'])
        }

        return null
    }
}
