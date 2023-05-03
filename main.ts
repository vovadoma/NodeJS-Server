import path from 'node:path';
import { Logger } from './lib/logger.js';
import { loadEnv, loadDir, loadApps } from './src/loader.js';

(async () => {

  const sandbox: any = {
    process,
  };

  const rootPath = process.cwd();
  const appPath = process.env.APPS_PATH || path.join(process.cwd(), './apps');
  const configPath = path.join(rootPath, './config');

  await loadEnv(rootPath);
  const config: any = await loadDir(configPath, sandbox);

  const logger = new Logger(config.logger);
  sandbox.logger = Object.freeze(logger);

  sandbox.admin = (await import('./apps/core/domain/admin')).init();

  const routing: any = await loadApps(
    appPath,
    {
      configPath: './config',
      apiPath: './api',
    },
    sandbox,
    true
  );

  console.dir(routing);
  const proc = routing.core.oauth.login;
  console.dir(proc());
  console.dir(await (await proc()).method());

})();
