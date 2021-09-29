import { readDir } from './readDir';
import path from 'path';
import { isDirectoryOrThrow } from './isDirectoryOrThrow';

export async function getFolderContent(workingDirectory: string): Promise<string[]> {
  await isDirectoryOrThrow(workingDirectory);

  return (await readDir(workingDirectory)).map((relativePath: string) => path.resolve(workingDirectory, relativePath));
}
