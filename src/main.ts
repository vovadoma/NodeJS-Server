import path from 'node:path';
import { Logger } from '../lib/logger.js';
import { loadEnv, loadDir, loadApps, loadConfig } from "../lib/loader.js";
import * as common from "../lib/common.js";
import crud from "../lib/crud.js";

(async () => {

  const sandbox: any = {
    //common,
    process,
    crud: null,
    logger: null,
  };

  const rootPath = process.cwd();

  await loadEnv(rootPath);
  const config: any = await loadConfig(rootPath);
  const appPath = config.apps.path;
  const logger = new Logger(config.logger);

  sandbox.logger = Object.freeze(logger);
  sandbox.crud = Object.freeze(crud(config.db));

  const routing: any = await loadApps(
    appPath,
    {
      domainPath: './domain',
      configPath: './config',
      apiPath: './api',
    },
    sandbox,
    true
  );

  console.dir(routing);
  //const proc = routing.core.oauth.login;
  //console.dir(proc());
  //console.dir(await (await proc()).method());


})();
