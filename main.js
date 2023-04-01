'use strict';

const path = require('node:path');
import { loadEnv, loadDir } from './src/loader';

(async () => {
  const sandbox = {
    process,
    console: Object.freeze(console),
  };

  const rootPath = process.cwd();
  const appPath = process.env.APPS_PATH || path.join(process.cwd(), './apps');
  const configPathServer = path.join(rootPath, './config');
  const configPathApps = path.join(appPath, './config');

  await loadEnv(rootPath);
  const config = await loadDir([configPathServer, configPathApps], sandbox);

  console.log(config);
})();