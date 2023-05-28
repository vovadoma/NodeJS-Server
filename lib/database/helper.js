'use strict';

const fsp = require('node:fs').promises;
const path = require('node:path');
const { access } = require('node:fs/promises');
const pg = require('pg');
const { loadConfig } = require('../loader.js');
const { logger } = require('../logger.js');

const runAction = async (action, params = {}) => {
  const appsNames = process.argv.slice(2);
  for (const appName of appsNames) {
    const config = await loadConfig(process.cwd());
    const appDir = path.join(config.apps.path, appName);
    const appConfig = await loadConfig(appDir);
    const dbConfig = params.dbConfig || appConfig.database;
    logger.info(`Start ${appName} ${action}`);
    if (!dbConfig) {
      logger.warn(`The ${appName} doesn't have database config!`);
      return;
    }
    const actionName = action.charAt(0).toUpperCase() + action.slice(1);
    const pool = new pg.Pool(dbConfig);
    const sqlFiles = await loadSqlFiles(path.join(path.join(appDir, 'db/' + action)), '.sql', params.prismaStyle);
    const filteredSqlFiles = params.filterCallback ? await params.filterCallback(pool, sqlFiles) : sqlFiles;
    logger.info(filteredSqlFiles.length ? `${actionName} files:` : `No ${action} to run!`);
    await runSqlFiles(pool, filteredSqlFiles, params);
    await pool.end();
    logger.info(`${actionName} complete!`);
  }
};

const runSqlFiles = async (pool, sqlFiles, params = {}) => {
  for (const sqlFile of sqlFiles) {
    logger.info(sqlFile.file);
    const src = await fsp.readFile(sqlFile.path, 'utf8');
    try {
      const commands = params.byOneCommand
        ? src.split(';\n').filter((s) => s.trim() !== '')
        : [src];
      for (const command of commands) {
        await pool.query(command);
      }
      params.doneCallback ? await params.doneCallback(pool, sqlFile) : null;
    } catch (err) {
      logger.error(err.message);
    }
  }
};

const loadSqlFiles = async (dir, ext, prismaStyle = '') => {
  if (await access(dir).catch((e) => e)) {
    return [];
  }
  return (await fsp.readdir(dir, { withFileTypes: true }))
    .filter((file) => (file.isDirectory() || file.name.endsWith(ext)))
    .map((file) => {
      const fname = path.join(dir, file.name);
      return file.isFile() ?
        { file: file.name, path: fname } :
        (prismaStyle ? { file: file.name, path: path.join(fname, prismaStyle) } : null);
    })
    .filter((a) => a)
    .sort((a, b) => a.file.localeCompare(b.file));
};

module.exports = { runAction };
