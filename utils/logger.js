const pino = require('pino');
const { multistream } = require('pino-multi-stream');
const fs = require('fs');
const path = require('path');
const rfs = require('rotating-file-stream');

const colors = {
    1: '\x1b[31m', // Красный
    2: '\x1b[32m', // Зелёный
    3: '\x1b[33m', // Жёлтый
    4: '\x1b[34m', // Синий
    5: '\x1b[35m', // Пурпурный
    6: '\x1b[36m', // Голубой
    7: '\x1b[37m', // Белый
};

// eslint-disable-next-line no-unused-vars
function colorizeText(message) {
    return message.replace(/&(\d)(.*?)&/g, (match, colorCode, p1) => {
        const color = colors[colorCode] || '\x1b[39m';
        return color + p1 + '\x1b[39m';
    });
}

const logDirectory = path.join(__dirname, '../logs');
const logFileName = () => {
    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${year}-${month}-${day}.log`;
};

if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory);
}

const logStream = rfs.createStream(logFileName(), {
    interval: '1d',
    path: logDirectory,
    size: '10M',
    compress: true,
    maxFiles: 30,
});

const streams = [
    {
        stream: pino.transport({
            target: 'pino-pretty',
            options: {
                colorize: true,
                translateTime: 'yyyy-mm-dd HH:MM:ss',
                ignore: 'pid,hostname',
                hideObject: true,
                sync: true,
            },
        }),
    },
    {
        stream: logStream,
    },
];

const pinoLogger = pino(
    {
        level: 'debug',
    },
    multistream(streams)
);

const logger = {
    info: (message) => pinoLogger.info(message),
    error: (message) => pinoLogger.error(message),
    warn: (message) => pinoLogger.warn(message),
    debug: (message) => pinoLogger.debug(message),
    fatal: (message) => pinoLogger.fatal(message),
};

module.exports = logger;
