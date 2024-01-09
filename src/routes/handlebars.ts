import Handlebars from 'handlebars';
import {
  default as express,
  RequestHandler,
  Locals
} from 'express';
import fs from 'node:fs';

import { compileFile } from '../utils';

const viewDirectory = 'src/views';
const viewNames = fs.readdirSync(viewDirectory)
.filter(name => name.endsWith('.hbs') && !name.startsWith('.'));
const styleDirectory = fs.readdirSync('src/public/styles');
const scriptDirectory = fs.readdirSync('src/public/scripts');
const mainLayout = compileFile(`${viewDirectory}/layouts/main.hbs`);

// important: update as site gets made
const mainPaths = viewNames.map(name => name.slice(0, -4));

const router = express.Router();

Handlebars.registerPartial(
  'header',
  fs.readFileSync(
    `${viewDirectory}/partials/header.hbs`,
    { encoding: 'utf8' }
  )
);

Handlebars.registerHelper('equals', (a, b) => a === b);

interface RenderOptions {
  headContext: object,
  templateContext: object,
  useDefaultStyles: boolean,
  styles: string[],
  scripts: string[]
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

  if (useDefaultStyles) styles.push('default');
  styles.push(...localStyles);
  if (styleDirectory.includes(`${viewName}.css`)) styles.push(viewName);

  scripts.push(...localScripts);
  if (scriptDirectory.includes(`${viewName}.js`)) scripts.push(viewName);

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

  if (!viewNames.includes(`${viewName}.hbs`)) return next();

  res.send(render(viewName, toRenderOptions(res.locals)));
});

export default router;
