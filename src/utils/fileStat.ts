import { promisify } from 'util';
import fs from 'fs';

export const fileStat = promisify(fs.stat);