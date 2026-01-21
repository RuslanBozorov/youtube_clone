import {createLogger, format, transports} from 'winston'

const customFormat = format.combine(
    format.timestamp({format:"YYYY-MM-DD HH:mm:ss"}),
    format.errors({stack:true}),
    format.printf((info)=>{

        //infosidan olinadi const {} = info
        const{
            timestamp,
            level,
            message,
            method,
            url,
            stack,
            ...meta
            }=info

            return  `
            ${timestamp} ${level.toUpperCase()} [${method || meta.method} : ${url || meta.url}] MESSAGE: ${message} ${stack ? `STACK:${stack}` : ""} META: ${Object.keys(meta).length ? JSON.stringify(meta,null,2) : "-"} `.trim()
    })
);
 

export const Logger = createLogger({
    level:'info',
    format:customFormat,
    transports:[
        new transports.File({filename:'src/logs/logger.log', handleExceptions:true}),
    ],
    exitOnError:false,
})

