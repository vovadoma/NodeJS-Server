'use strict';

const fsp = require('node:fs').promises;
const path = require('node:path');
const { access } = require('node:fs/promises');
const pg = require('pg');
const { loadConfig } = require('./loader.js');
const { logger } = require('./logger.js');

const POSTGRES = {
  host: '127.0.0.1',
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: 'postgres',
};

const rootPath = process.cwd();

const up = async () => {
  const config = await loadConfig(rootPath);
  const appsPath = config.apps.path;
  const appsDirs = await getAppsDirs(appsPath);

  for (const appDir of appsDirs) {
    const appName = appDir.name;
    const appPath = path.join(appsPath, appName);
    const appConfig = await loadConfig(appPath);
    const dbConf = appConfig.database;
    const sqlFiles = await loadSetupSqlFiles(appPath);
    logger.info(`Setup ${appName}`);
    await doSetup(appName, dbConf, sqlFiles);
    logger.info('Complete!');
  }
};

const doSetup = async (appName, dbConf, sqlFiles) => {


  const client = new pg.Client(POSTGRES);
  await client.connect();

  for (const sqlFile of sqlFiles) {
    logger.info(sqlFile);
    const src = await fsp.readFile(sqlFile, 'utf8');
    const commands = src.split(';\n').filter((s) => s.trim() !== '');
    for (const command of commands) {
      try {
        await client.query(command);
        logger.info(command);
      } catch (err) {
        logger.error(err.message);
      }
    }
  }

  await client.end();
};

const getAppsDirs = async (appPath) => (await fsp.readdir(appPath, { withFileTypes: true }))
  .filter((file) => file.isDirectory());

const loadSetupSqlFiles = async (appDir) => {
  const SetupDir = path.join(path.join(appDir, 'db/setup'));
  return await loadDirFiles(SetupDir, '.sql');
};

const loadDirFiles = async (dir, ext) => {
  if (await access(dir).catch((e) => e)) {
    return [];
  }
  return (await fsp.readdir(dir, { withFileTypes: true }))
    .filter((file) => !(file.isFile() && !file.name.endsWith(ext)))
    .map((file) => {
      const fname = path.join(dir, file.name);
      return file.isFile() ? fname : null;
    })
    .filter((a) => a)
    .sort((a, b) => a.localeCompare(b));
};

(async () => {
  await up();
})();
