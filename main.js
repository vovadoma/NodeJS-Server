//'use strict';

import path from 'node:path';
import { loadEnv, loadDir, loadApps } from './src/loader.js';

(async () => {
  const sandbox = {
    process,
    console: Object.freeze(console),
  };

  const rootPath = process.cwd();
  const appPath = process.env.APPS_PATH || path.join(process.cwd(), './apps');
  const configPath = path.join(rootPath, './config');

  await loadEnv(rootPath);
  const config = await loadDir(configPath, sandbox);
  console.log(config);

  /*
  const routing = await loadApps(
    appPath, {
      configPath: './config',
      apiPath: './api',
    },
    sandbox
  );

  console.log(config);
  console.log(routing);

   */
})();