'use strict';

import * as fsp from 'node:fs/promises';
import vm from 'node:vm';
import path from 'node:path';

const OPTIONS = {
  timeout: 5000,
  displayErrors: false
};

const load = async (filePath, sandbox, contextualize = false) => {
  const src = await fsp.readFile(filePath, 'utf8');
  const context = vm.createContext({ ...sandbox });
  const module = new vm.SourceTextModule(src, { context });
  await module.link(() => {});
  const m = await module.evaluate();
  console.log(m)
  return {}; //module.evaluate();
  //return vm.runInContext(src, context);
};

const loadOld = async (filePath, sandbox, contextualize = false) => {
  const src = await fsp.readFile(filePath, 'utf8');
  const opening = contextualize ? '(context) => ' : '';
  const code = `'use strict';\n${opening}{\n${src}\n}`;
  const script = new vm.Script(code, { ...OPTIONS, lineOffset: -2 });
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
  let routing = {};
  const { configPath, apiPath } = params;
  const dirs = await fsp.readdir(appDir, { withFileTypes: true });
  for (const dir of dirs) {
    if (dir.isFile()) continue;
    const { name } = dir;
    const appConfig = await loadDir(path.join(appDir, name, configPath), sandbox);
    const appSandbox = Object.freeze({ ...sandbox , ...{ config: appConfig }});
    const appRouting = await loadDir(path.join(appDir, name, apiPath), appSandbox);
    routing = { ...routing, ...appRouting };
  }
  return routing;
};

const loadEnv = async (dir, name = '.env') => {
  const location = path.join(dir, name);
  const exists = await fsp.access(location).then(() => true).catch(() => false);
  if (exists) {
    const src = await fsp.readFile(location, 'utf8');
    (src.split('\n') || []).forEach(line => {
      const value = line.split('=').map(v => (v || '').trim());
      if (value[0] && value[1]) {
        process.env[value[0]] = value[1];
      }
    })
  }
};

export { load, loadDir, loadEnv, loadApps };