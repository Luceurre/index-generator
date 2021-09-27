import { isFile } from './isFile';
import { getFolderContent } from './getFolderContent';

export const getFilePathsMatching = async (regex: RegExp, workingDirectory: string): Promise<string[]> => {
  const folderContent = await getFolderContent(workingDirectory);

  const result: string[] = [];
  for (const folderItem of folderContent) {
    if ((await isFile(folderItem)) && regex.test(folderItem)) {
      result.push(folderItem);
    }
  }
  return result;
};
