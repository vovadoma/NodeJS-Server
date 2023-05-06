import { readFile, readdir, access } from 'node:fs/promises';
import vm from 'node:vm';
import path from 'node:path';
import { promises as fsp } from 'node:fs';

const OPTIONS = {
  timeout: 5000,
  displayErrors: false,
};

const load = async (filePath, sandbox, contextualize = false) => {
  const src = await fsp.readFile(filePath, 'utf8');
  const opening = contextualize ? '(context) => ' : '';
  const code = `'use strict';\n${opening}${src}`;
  const script = new vm.Script(code, { ...OPTIONS, lineOffset: -1 });
  const context = vm.createContext(Object.freeze({ ...sandbox }));
  return script.runInContext(context, OPTIONS);
};

const loadDir = async (dir, sandbox, contextualize = false) => {
  const files = await fsp.readdir(dir, { withFileTypes: true });
  const container = {};
  for (const file of files) {
    const { name } = file;
    if (file.isFile() && !name.endsWith('.js')) continue;
    const location = path.join(dir, name);
    const key = path.basename(name, '.js');
    const loader = file.isFile() ? load : loadDir;
    container[key] = await loader(location, sandbox, contextualize);
  }
  return container;
};

const loadApps = async (appDir, params, sandbox, contextualize = false) => {
  const routing = {};
  const { configPath, apiPath } = params;
  const dirs = await readdir(appDir, { withFileTypes: true });
  for (const dir of dirs) {
    if (dir.isFile()) continue;
    const { name } = dir;
    const appConfig = await loadDir(
      path.join(appDir, name, configPath),
      sandbox,
      contextualize
    );
    const appSandbox = Object.freeze({ ...sandbox, ...{ config: appConfig } });
    routing[name] = await loadDir(
      path.join(appDir, name, apiPath),
      appSandbox,
      contextualize
    );
  }
  return routing;
};

const loadEnv = async (dir, name = '.env') => {
  const location = path.join(dir, name);
  const exists = await access(location)
    .then(() => true)
    .catch(() => false);
  if (!exists) {
    return;
  }
  const src = await readFile(location, 'utf8');
  src?.split('\n').forEach((line) => {
    const value = line.split('=').map((v) => v.trim());
    if (value[0] && value[1]) {
      process.env[value[0]] = value[1];
    }
  });
};

const loadConfig = async (dir) => {
  const rootPath = process.cwd();
  const configPath = path.join(rootPath, dir);
  await loadEnv(rootPath);
  return await loadDir(configPath, {
    process, path
  });
}

export { load, loadDir, loadEnv, loadApps, loadConfig };
