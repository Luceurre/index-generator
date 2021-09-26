import { fileStat } from './fileStat';

export async function isFile(itemPath: string) {
  return (await fileStat(itemPath)).isFile();
}
