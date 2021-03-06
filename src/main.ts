import {get_root_logger} from './root-logger'
import {start_server} from './start-server'

const root_logger = get_root_logger()

start_server(root_logger).catch(function (error) {
    console.error(error)
    process.exit(1)
})
