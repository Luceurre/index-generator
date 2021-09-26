import { execSync } from 'child_process';

const grepCommandBuilder = (regex: string, filePaths: string[]) => {
    const filePathListInlined = filePaths.join(' ');
    return `grep -lEs '${regex}' ${filePathListInlined} || true`;
};

export const getFilesContaining = (regex: string, filePaths: string[], cwd: string): string[] => {
    if (filePaths.length === 0) {
        return [];
    }
    const grepCommand = grepCommandBuilder(regex, filePaths);
    const result = execSync(grepCommand, { cwd });

    return result.toString().split('\n').filter(filePath => filePath !== '');
};