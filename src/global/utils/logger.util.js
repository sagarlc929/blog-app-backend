import { createLogger, transports, format } from 'winston';

const customFormatConsole = format.combine(
  format.printf((info) => {
    return `[${info.level.toUpperCase().padEnd(7)}] - ${info.message}`;
  })
);

const customFormatFile = format.combine(
  format.timestamp(),
  format.printf((info) => {
    return `${info.timestamp}=>[${info.level.toUpperCase().padEnd(7)}] - ${info.message}`;
  })
);

const logger = createLogger({
  transports: [
    new transports.Console({ level: 'silly', format: customFormatConsole }),
    new transports.File({
      filename: './logs/user.log',
      level: 'info',
      format: customFormatFile,
    }),
  ],
});

export default logger;

/*
  * level of logger 
  error
  warn
  info
  debug
  silly
  verbose
*/
