'use strict';

const { runAction } = require('./helper');
const { logger } = require('../logger');

const prismaStyle = '/migration.sql';
const tableName = '_migrations';

const doneCallback = async (pool, sqlFile) => {
  await pool.query(`INSERT INTO ${tableName} (file) VALUES ($1)`, [sqlFile.file]);
}

const filterCallback = async (pool, sqlFiles) => {
  try {
    const filesMigrated = (await pool.query(`SELECT * FROM ${tableName}`))
      .rows.map(file => file.file);
    return sqlFiles.filter(file => !filesMigrated.includes(file.file));
  } catch (e) {
    logger.info(e.message);
    return sqlFiles;
  }
}

(async () => {
  await runAction('migrations', { prismaStyle, doneCallback, filterCallback });
})();


// https://www.maibornwolff.de/en/know-how/migrations-nodejs-and-postgresql/
// https://www.antoniovdlc.me/a-look-at-postgresql-migrations-in-node/