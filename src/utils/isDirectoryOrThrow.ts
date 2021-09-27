import { isDirectory } from './isDirectory';

export const isDirectoryOrThrow = async (directory: string): Promise<void> => {
  if (!(await isDirectory(directory))) {
    throw 'Argument workingDir should be an existing directory.';
  }
};
