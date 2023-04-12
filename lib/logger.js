const pino = require('pino');
const path = require('node:path');

export class Logger {

  constructor (config) {

    const targets = [
      { target: 'pino-pretty', options: { destination: 1 } }
    ];

    if (config.path) {
      const date = new Date().toISOString().substring(0, 10);
      const filePath = path.join(config.path, `${date}.log`);
      const fileTarget = {
        target: 'pino/file',
        options: { destination: filePath, mkdir: true }
      };
      if (config.level) {
        fileTarget.level = config.level;
      }
      targets.push(fileTarget);
    }

    const transport = pino.transport({
      targets,
      options: {
        destination: 1,
        colorize: true
      }
    })

    this.logger = pino(transport);
  }

  log (...arg) {
    this.logger.info(...arg);
  }

  error (...arg) {
    this.logger.error(...arg);
  }

  debug (...arg) {
    this.logger.debug(...arg);
  }

}
