'use strict';

const path = require('node:path');
import { Logger } from './lib/logger';
import { loadEnv, loadDir, loadApps } from './src/loader';

(async () => {

  const sandbox = {
    process,
  };

  const rootPath = process.cwd();
  const appPath = process.env.APPS_PATH || path.join(process.cwd(), './apps');
  const configPath = path.join(rootPath, './config');

  await loadEnv(rootPath);
  const config = await loadDir(configPath, sandbox);

  const logger = new Logger(config.logger);
  sandbox.console = Object.freeze(logger);

  const routing = await loadApps(
    appPath, {
      configPath: './config',
      apiPath: './api',
    },
    sandbox
  );

  logger.log(config);
  logger.log(routing);
})();
