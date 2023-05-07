import { promises as fsp } from "node:fs";
import { loadConfig } from "./loader.js";
import path from "node:path";
import { access } from "node:fs/promises";
import pg from 'pg';
import { logger } from "./logger.js";

const rootPath = process.cwd();
const prismaStyle = '/migration.sql';
const tableName = '_migrations';

const up = async () => {
  const config = await loadConfig(rootPath);
  const appsPath = config.apps.path;
  const appsDirs = await getAppsDirs(appsPath);

  for (const appDir of appsDirs) {
    const appName = appDir.name;
    const appPath = path.join(appsPath, appName);
    const appConfig = await loadConfig(appPath);
    const dbConf = appConfig.database;
    const sqlFiles = await loadMigrateSqlFiles(appPath);
    await doMigration(appName, dbConf, sqlFiles);
  }

}

const doMigration = async (appName, dbConf, sqlFiles) => {
  logger.info(`Start ${appName} migration`);
  if (!dbConf) {
    logger.warn(`The ${appName} doesn't have database config`);
    return;
  }

  const pool = new pg.Pool(dbConf);

  for (const sqlFile of sqlFiles) {
    logger.info(sqlFile);
    const src = await fsp.readFile(sqlFile, 'utf8');
    logger.info(src)
    await pool.query(src).catch(e => {
      logger.error(e.message);
    });
  }

  await pool.end();
  logger.info(`Done ${appName} migration`);
}

const getAppsDirs = async (appPath) => {
  return (await fsp.readdir(appPath, { withFileTypes: true }))
    .filter(file => file.isDirectory());
}

const loadMigrateSqlFiles = async (appDir) => {
  const migrateDir = path.join(path.join(appDir, 'db/migrations'));
  return await loadDirFiles(migrateDir, '.sql');
}

const loadDirFiles = async (dir, ext) => {
  if (await access(dir).catch(e => e)) {
    return [];
  }
  return (await fsp.readdir(dir, { withFileTypes: true }))
    .filter(file => !(file.isFile() && !file.name.endsWith(ext)))
    .map(file => {
      const fname = path.join(dir, file.name);
      return file.isFile()
        ? fname
        : (prismaStyle ? path.join(fname, prismaStyle) : null)
    })
    .filter(a => a)
    .sort((a, b) => a.localeCompare(b));
}

(async () => {
  await up();
})();
