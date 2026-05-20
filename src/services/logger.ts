/**
 * Logger centralizado para EsLoQueHay.
 * En desarrollo: logs a consola.
 * En producción: solo warn/error van a consola (o a servicio externo futuro).
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const CURRENT_LEVEL: LogLevel = import.meta.env.MODE === 'production' ? 'warn' : 'debug';

function shouldLog(level: LogLevel): boolean {
  return LEVELS[level] >= LEVELS[CURRENT_LEVEL];
}

function formatMessage(
  level: LogLevel,
  context: string,
  message: string,
  ...args: unknown[]
): [string, ...unknown[]] {
  const timestamp = new Date().toISOString();
  return [`[${timestamp}] [${level.toUpperCase()}] [${context}] ${message}`, ...args];
}

export const logger = {
  debug(context: string, message: string, ...args: unknown[]) {
    if (shouldLog('debug')) {
      console.debug(...formatMessage('debug', context, message, ...args));
    }
  },
  info(context: string, message: string, ...args: unknown[]) {
    if (shouldLog('info')) {
      console.info(...formatMessage('info', context, message, ...args));
    }
  },
  warn(context: string, message: string, ...args: unknown[]) {
    if (shouldLog('warn')) {
      console.warn(...formatMessage('warn', context, message, ...args));
    }
  },
  error(context: string, message: string, ...args: unknown[]) {
    if (shouldLog('error')) {
      console.error(...formatMessage('error', context, message, ...args));
    }
  },
};
