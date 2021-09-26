import path from 'path';
import { isDirectory } from './isDirectory';
import { readDir } from './readDir';
import { isFile } from './isFile';

export const getFilePathsMatching = async (regex: RegExp, workingDir: string): Promise<string[]> => {
    if (!await isDirectory(workingDir)) {
        throw 'Argument workingDir should be an existing directory.';
    }

    const folderContent = (await readDir(workingDir)).map(relativePath => path.resolve(workingDir, relativePath));
    const result: string[] = [];

    for (const folderItem of folderContent) {
        if (await isFile(folderItem) && regex.test(folderItem)) {
            result.push(folderItem);
        }
    }
    return result;
};