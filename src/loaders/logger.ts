import winston from 'winston';
import getAppConfig from '../config/app-config';
import { getNamespace } from 'cls-hooked';

const logFormat = winston.format.printf(info => {
  let message = `${info.timestamp} ${info.level}: ${info.message}`;
  const namespace = getNamespace('MOON_SERVICE_NAMESPACE');
  if (namespace && namespace.get('REQUEST_ID')) {
    const requestId = namespace.get('REQUEST_ID');
    message += ` -> Request Id: ${requestId}`;
  }
  return message;
});

const transports = [];
transports.push(
  new winston.transports.File({
    filename: `logs/moon-service.log`
  })
);
if (process.env.NODE_ENV !== 'development') {
  transports.push(
    new winston.transports.Console({
      format: logFormat
    })
  );
} else {
  transports.push(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.cli(),
        winston.format.splat(),
        logFormat
      )
    })
  );
}

const appConfig = getAppConfig();

const loggerInstance = winston.createLogger({
  level: appConfig.logs.level,
  levels: winston.config.npm.levels,
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  transports
});

export default loggerInstance;
