import { fileStat } from './fileStat';

export async function isDirectory(rootDir: string): Promise<boolean> {
  const stat = await fileStat(rootDir).catch(() => undefined);

  return stat !== undefined && stat.isDirectory();
}
