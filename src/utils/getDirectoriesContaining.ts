import { getFolderContent } from './getFolderContent';
import { isDirectory } from './isDirectory';
import { getFilePathsMatching } from './getFilePathsMatching';

export const getDirectoriesContaining = async (regex: RegExp, workingDirectory: string): Promise<string[]> => {
  const folderContent = await getFolderContent(workingDirectory);

  const result: string[] = [];
  for (const folderItem of folderContent) {
    if ((await isDirectory(folderItem)) && (await getFilePathsMatching(regex, folderItem)).length > 0) {
      result.push(folderItem);
    }
  }
  return result;
};
