import {Dayjs} from 'dayjs'

import {Duration} from '../types'

export interface IUptime {
    get_started_at(): Dayjs
    get_uptime(): Duration
}
