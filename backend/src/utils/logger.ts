import winston from 'winston';
import 'winston-daily-rotate-file';

enum LogLevel {
  ERROR = 0,
  WARN,
  INFO,
  HTTP,
  DEBUG,
}

enum LogColor {
  ERROR = 'red',
  WARN = 'yellow',
  INFO = 'green',
  HTTP = 'magenta',
  DEBUG = 'white',
}

const levels = {
  error: LogLevel.ERROR,
  warn: LogLevel.WARN,
  info: LogLevel.INFO,
  http: LogLevel.HTTP,
  debug: LogLevel.DEBUG,
};

const colors = {
  error: LogColor.ERROR,
  warn: LogColor.WARN,
  info: LogColor.INFO,
  http: LogColor.HTTP,
  debug: LogColor.DEBUG,
};

winston.addColors(colors);

export const Logger = winston.createLogger({
  levels,
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
    winston.format.colorize({ all: true }),
    winston.format.printf(
      (msg) => `${msg.timestamp} ${msg.level}: ${msg.message}`
    ),
    winston.format.errors({ stack: true })
  ),
});
