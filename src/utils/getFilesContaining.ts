import { execSync } from 'child_process';

const grepCommandBuilder = (regex: string, filePaths: string[], notMatching: boolean = false) => {
  const filePathListInlined = filePaths.join(' ');
  return `grep -lEs ${notMatching ? '-v' : ''} '${regex}' ${filePathListInlined} || true`;
};

export const getFilesContaining = (
  regex: string,
  filePaths: string[],
  cwd: string,
  notMatching: boolean = false,
): string[] => {
  if (filePaths.length === 0) {
    return [];
  }
  const grepCommand = grepCommandBuilder(regex, filePaths, notMatching);
  const result = execSync(grepCommand, { cwd });

  return result
    .toString()
    .split('\n')
    .filter((filePath) => filePath !== '');
};
