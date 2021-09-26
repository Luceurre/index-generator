import { promisify } from 'util';
import fs from 'fs';

export const readDir = promisify(fs.readdir);
