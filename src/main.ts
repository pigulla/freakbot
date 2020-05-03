import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import relative_time from 'dayjs/plugin/relativeTime'

import {get_root_logger} from './root-logger'
import {start_server} from './start-server'

dayjs.extend(relative_time)
dayjs.extend(duration)

const root_logger = get_root_logger()

start_server(root_logger).catch(function (error) {
    console.error(error)
    process.exit(1)
})
