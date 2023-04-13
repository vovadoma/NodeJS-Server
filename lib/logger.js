const pino = require('pino');
const path = require('node:path');

export class Logger {
  constructor (config) {
    const targets = [];

    if (config.stdout) {
      targets.push({
        target: config.stdout.target,
        level: config.stdout.level,
        options: { destination: 1 }
      });
    }

    if (config.file) {
      const date = new Date().toISOString().substring(0, 10);
      const filePath = path.join(config.file.path, `${date}.log`);
      console.log(config.file.level)
      targets.push({
        target: config.file.target,
        level: config.file.level,
        options: { destination: filePath, mkdir: true }
      });
    }

    const transport = pino.transport({
      targets,
      options: {
        colorize: config.colorize,
      },
    });

    this.logger = pino(transport);
  }

  log (...arg) {
    this.logger.info(...arg);
  }

  error (...arg) {
    this.logger.error(...arg);
  }

  warn (...arg) {
    this.logger.warn(...arg);
  }

  debug (...arg) {
    this.logger.debug(...arg);
  }
}
