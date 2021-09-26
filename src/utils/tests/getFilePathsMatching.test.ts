import { getFilePathsMatching } from '../getFilePathsMatching';
import * as path from 'path';

const FIXTURES_BASE_DIR = `${__dirname}/fixtures/getFilePathsMatchingFixtures/`;

describe('getFilePathsMatching', function () {
  it('should rejects if working directory is not found', async function () {
    const cwd = '/not_an_existing_directory';
    await expect(getFilePathsMatching(/a regex/, cwd)).rejects.toStrictEqual(
      'Argument workingDir should be an existing directory.',
    );
  });

  it('should rejects if working directory is a file', async function () {
    await expect(getFilePathsMatching(/a regex/, FIXTURES_BASE_DIR + 'not_a_directory.txt')).rejects.toStrictEqual(
      'Argument workingDir should be an existing directory.',
    );
  });

  it('should should not look in subdirectory', async function () {
    await expect(getFilePathsMatching(/.*/, FIXTURES_BASE_DIR)).resolves.toStrictEqual(
      ['Component.tsx', 'index.ts', 'not_a_directory.txt'].map((filePath) => path.join(FIXTURES_BASE_DIR, filePath)),
    );
  });

  it('should only return files matching regex', async function () {
    await expect(getFilePathsMatching(/\.tsx?/, FIXTURES_BASE_DIR)).resolves.toStrictEqual(
      ['Component.tsx', 'index.ts'].map((filePath) => path.join(FIXTURES_BASE_DIR, filePath)),
    );
  });
});
