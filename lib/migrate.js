import { promises as fsp } from "node:fs";
import { loadConfig } from "./loader.js";
import path from "node:path";
import { access } from "node:fs/promises";

const up = async () => {
  const config = await loadConfig('./config');
  const appPath = config.apps.path;
  const appsDirs = await getAppsDirs(appPath);
  for (const appDir of appsDirs) {
    const sqlFiles = await loadMigrateSqlFiles(path.join(appPath, appDir.name));
    console.log(sqlFiles);
  }
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
    .filter(file => file.isFile()  && file.name.endsWith(ext))
    .map(file => path.join(dir, file.name))
    .sort((a, b) => a.localeCompare(b));
}

(async () => {
  await up();
})();