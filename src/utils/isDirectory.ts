import { fileStat } from './fileStat';

export async function isDirectory(rootDir: string): Promise<boolean> {
    return (await fileStat(rootDir)).isDirectory();
}