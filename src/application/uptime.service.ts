import dayjs, {Dayjs} from 'dayjs'

import {IUptime} from '../domain/uptime.interface'
import {Duration} from '../types'

export class Uptime implements IUptime {
    private readonly started_at: Dayjs

    public constructor() {
        this.started_at = dayjs()
    }

    public get_started_at(): Dayjs {
        return this.started_at
    }

    public get_uptime(): Duration {
        const seconds = dayjs().unix() - this.started_at.unix()

        return dayjs.duration(seconds, 'seconds')
    }
}
