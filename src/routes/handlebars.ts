import Handlebars from 'handlebars';
import express from 'express';
import fs from 'node:fs';

import { ignore, protect } from '../special-routes';

const viewDirectory = 'src/views';
const viewNames = fs.readdirSync(viewDirectory)
.filter(name => name.endsWith('.hbs') && !name.startsWith('.'));
const styleDirectory = fs.readdirSync('src/public/styles');
const scriptDirectory = fs.readdirSync('src/public/scripts');
const defaultScriptDirectory = fs.readdirSync('src/public/scripts/default').filter(name => name.endsWith('.js'));
const mainLayout = compileFile(`${viewDirectory}/layouts/main.hbs`);

const mainPaths = viewNames
.map(name => name.slice(0, -4))
.filter(name => !ignore.includes(name));

const router = express.Router();

const partialNames = fs.readdirSync(`${viewDirectory}/partials`);

for (let name of partialNames) {
  Handlebars.registerPartial(
    name.slice(0, -4),
    fs.readFileSync(
      `${viewDirectory}/partials/${name}`,
      { encoding: 'utf8' }
    )
  );
}

Handlebars.registerHelper('equals', (a, b) => a === b);

interface RenderOptions {
  headContext: object,
  templateContext: object,
  useDefaultStyles: boolean,
  styles: string[],
  scripts: string[]
}

export function compileFile(path: string) {
  const file = fs.readFileSync(path, { encoding: 'utf8' });
  return Handlebars.compile(file);
}

export function toRenderOptions($: any): RenderOptions {
  return {
    headContext: $?.headContext ?? {},
    templateContext: $?.templateContext ?? {},
    useDefaultStyles: $?.useDefaultStyles ?? true,
    styles: $?.styles ?? [],
    scripts: $?.scripts ?? []
  };
}

export function render(viewName: string, locals: RenderOptions): string {
  const template = compileFile(`${viewDirectory}/${viewName}.hbs`);

  const styles: string[] = [];
  const scripts: string[] = [];

  const {
    headContext,
    templateContext,
    useDefaultStyles,
    styles: localStyles,
    scripts: localScripts
  } = locals;

  if (useDefaultStyles) styles.push('default/default');
  styles.push(...localStyles);
  if (styleDirectory.includes(`${viewName}.css`)) styles.push(viewName);

  scripts.push(...localScripts);
  if (scriptDirectory.includes(`${viewName}.js`)) scripts.push(viewName);

  for (let script of defaultScriptDirectory) {
    scripts.push('default/' + script.slice(0, -3));
  }

  return mainLayout({
    title: viewName,
    styles,
    scripts,
    ...headContext,

    body: template({
      title: viewName,
      mainPaths,
      ...templateContext
    })
  });
}

router.use((req, res, next) => {
  const viewName = req.path.replace(/^\/(.+?)\/?$/, '$1');

  if (!viewNames.includes(`${viewName}.hbs`) || res.locals.error.hasOwnProperty('code')) {
    return next();
  }

  if (req.isAuthenticated()) res.locals.templateContext.protectedPaths = protect;

  res.send(render(viewName, toRenderOptions(res.locals)));
});

export default router;
