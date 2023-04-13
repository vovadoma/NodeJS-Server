({
  stdout: {
    target: 'pino-pretty',
    level: 'trace',
    colorize: true,
  },
  file: {
    target: 'pino/file',
    level: 'error',
    path: './log/'
  }
});
