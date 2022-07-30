const winston = require('winston');
const winstonDaily = require('winston-daily-rotate-file');
const appRoot = require('app-root-path');
const process = require('process');

const logDir = '${appRoot}/logs';
//const logDir = './logs';

const {
    combine,
    timestamp,
    label,
    printf
} = winston.format;

const logFormat = printf(({
    level,
    message,
    label,
    timestamp
}) => {
    return '${timestamp} [${label}] ${level}: ${message}';
})
// log level : 
// error:0, warn:1, info:2, http:3, verbose:4, debug:5, silly:6
const logger = winston.createLogger({
    format: combine(
        label({
            label: 'LogTestSystem',
        }),
        timestamp({
            format: 'YYYY-MM-DD HH:MI:SS',
        }),
        logFormat
    ),
    transports: [
        //
        // - Write all logs with importance level of `error` or less to `error.log`
        // - Write all logs with importance level of `info` or less to `combined.log`
        //
        new winstonDaily({
            level: 'info',
            datePattern: 'YYYY-MM-DD',
            dirname: logDir,
            filename: '%DATE%.log',
            maxFiles: 30,
            zippedArchive: true,
        }),
        new winstonDaily({
            level: 'error',
            datePattern: 'YYYY-MM-DD',
            dirname: logDir,
            filename: '%DATE%.error.log',
            maxFiles: 30,
            zippedArchive: true,
        })
    ],
    exceptionHandlers: [
        new winstonDaily({
            level: 'error',
            datePattern: 'YYYY-MM-DD',
            dirname: logDir,
            filename: '%DATE%.exception.log',
            maxFiles: 30,
            zippedArchive: true,
        })
    ]
});

//Production 환경이 아닌 경우
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple(),
        )
    }));
}

module.exports = logger;