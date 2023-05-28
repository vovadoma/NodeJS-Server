'use strict';

const { runAction } = require('./helper');

const dbConfig = {
  host: '127.0.0.1',
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: 'postgres',
};

(async () => {
  await runAction('setup', { dbConfig, byOneCommand: true });
})();
