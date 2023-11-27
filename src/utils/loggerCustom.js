const winston = require('winston')

const customLevelsOptions = {
    levels: {
        fatal: 0,
        error: 1,
        warn: 2,
        info: 3,
        debug: 4
    }
}

const logger = winston.createLogger({
    
    format: winston.format.combine(
        winston.format.colorize({ all: true }),  
        winston.format.simple()
    ),
    transports: [
        new winston.transports.Console()
    ]
});


 const addLogger = (req, res, next) => {
    req.logger = logger;
    req.logger.info(`${req.method} en ${req.url} - ${new Date().toLocaleTimeString()}`);

    next();
}

module.exports = {addLogger}
