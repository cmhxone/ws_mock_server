import process from "process";
import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

const { combine, timestamp, label, printf } = winston.format;

const logdir = `${process.cwd()}/logs`;

const logFmt = printf(({ level, message, label, timestamp }) => {
  return `[${timestamp}] [${label}] ${level}: ${message}`;
});

const logger = winston.createLogger({
  format: combine(
    timestamp({ format: "YYYY-MM-DD HH:mm:ss.SSS" }),
    label({ label: "My Logger" }),
    logFmt
  ),
  transports: [
    new winston.transports.Console({
      format: combine(
        winston.format.colorize(),
        timestamp({ format: "YYYY-MM-DD HH:mm:ss.SSS" }),
        label({ label: "My Logger" }),
        logFmt
      ),
    }),
    new DailyRotateFile({
      level: "debug",
      datePattern: "YYYY-HH-DD",
      dirname: logdir,
      filename: "%DATE%.log",
      maxFiles: 30,
      zippedArchive: true,
    }),
  ],
});

export { logger };
