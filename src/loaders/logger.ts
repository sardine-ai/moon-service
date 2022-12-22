import winston from 'winston';
import getAppConfig from '../config/app-config';

const logFormat = winston.format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)

const transports = [];
transports.push(
  new winston.transports.File({ 
    filename: `logs/moon-service.log`
  }),
)
if (process.env.NODE_ENV !== 'development') {
  transports.push(new winston.transports.Console());
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
