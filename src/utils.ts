import fs from 'node:fs';
import Handlebars from 'handlebars';

export function compileFile(path: string) {
  const file = fs.readFileSync(path, { encoding: 'utf8' });
  return Handlebars.compile(file);
}
