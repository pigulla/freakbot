import pino, {Logger} from 'pino'

const logger = pino({prettyPrint: true, level: 'trace'})

// Singletons are a no-no, but this is the only way to share the same Pino instance between the
// application itself (NestFactory.create) and the logger provider.

export function get_root_logger(): Logger {
    return logger
}
