import {Controller, Inject, Get} from '@nestjs/common'
import {NormalizedPackageJson} from 'read-pkg-up'
import simplegit, {SimpleGit} from 'simple-git/promise'
import {Dayjs} from 'dayjs'

import {Configuration, ILogger} from '../../domain'
import {IUptime} from '../../domain/uptime.interface'

export type StatusDTO = {
    application_version: string
    voicepack_revision: string | null
    started_at: Dayjs
}

@Controller()
export class StatusController {
    private readonly logger: ILogger
    private readonly package_json: NormalizedPackageJson
    private readonly git: SimpleGit
    private readonly uptime: IUptime

    public constructor(
        @Inject('ILogger') logger: ILogger,
        @Inject('IUptime') uptime: IUptime,
        @Inject('Configuration') config: Configuration,
        @Inject('package.json') package_json: NormalizedPackageJson,
    ) {
        this.logger = logger.child_for_controller(this)
        this.package_json = package_json
        this.git = simplegit(config.voicepack_path)
        this.uptime = uptime

        this.logger.info('Controller instantiated')
    }

    @Get('/status')
    public async get_status(): Promise<StatusDTO> {
        return {
            application_version: this.package_json.version,
            voicepack_revision: await this.get_voicepack_revision(),
            started_at: this.uptime.get_started_at(),
        }
    }

    private async get_voicepack_revision(): Promise<string | null> {
        if (await this.git.checkIsRepo()) {
            return this.git.revparse(['HEAD'])
        }

        return null
    }
}
