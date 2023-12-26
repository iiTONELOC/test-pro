import fs from 'fs';
import path from 'path';

export const schema = fs.readFileSync(path.resolve(process.cwd(), './src/bot/alfred/schema/schema.txt'), 'utf-8');

export default schema;
