'use strict';

const fsp = require('node:fs').promises;
const path = require('node:path');
const { access } = require('node:fs/promises');
const pg = require('pg');
const { loadConfig } = require('./loader.js');
const { logger } = require('./logger.js');

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
    const sqlFiles = await loadSeedSqlFiles(appPath);
    await doSeed(appName, dbConf, sqlFiles);
    logger.info('Seed complete!');
  }
};

const doSeed = async (appName, dbConf, sqlFiles) => {
  logger.info(`Start ${appName} seed`);
  if (!dbConf) {
    logger.warn(`The ${appName} doesn't have database config`);
    return;
  }

  const pool = new pg.Pool(dbConf);

  for (const sqlFile of sqlFiles) {
    logger.info(sqlFile);
    const src = await fsp.readFile(sqlFile, 'utf8');
    logger.info(src);
    await pool.query(src).catch((e) => {
      logger.error(e.message);
    });
  }

  await pool.end();
  logger.info(`Done ${appName} seed`);
};

const getAppsDirs = async (appPath) => (await fsp.readdir(appPath, { withFileTypes: true }))
  .filter((file) => file.isDirectory());

const loadSeedSqlFiles = async (appDir) => {
  const seedDir = path.join(path.join(appDir, 'db/seed'));
  return await loadDirFiles(seedDir, '.sql');
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
