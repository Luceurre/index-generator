import { getDirectoriesContaining } from '../getDirectoriesContaining';
import path from 'path';

const FIXTURES_BASE_DIR = `${__dirname}/fixtures/getDirectoriesContainingFixtures/`;

describe('getDirectoriesContaining', function () {
  it('should rejects if working directory is not found', async function () {
    const cwd = '/not_an_existing_directory';
    await expect(getDirectoriesContaining(/a regex/, cwd)).rejects.toStrictEqual(
      'Argument workingDir should be an existing directory.',
    );
  });

  it('should rejects if working directory is a file', async function () {
    await expect(getDirectoriesContaining(/a regex/, FIXTURES_BASE_DIR + 'not_a_directory.txt')).rejects.toStrictEqual(
      'Argument workingDir should be an existing directory.',
    );
  });

  it('should only return directories containing files matching regex', async function () {
    await expect(getDirectoriesContaining(/index\.j|tsx?/, FIXTURES_BASE_DIR)).resolves.toStrictEqual(
      ['directory_with_index_js', 'directory_with_index_ts'].map((filePath) => path.join(FIXTURES_BASE_DIR, filePath)),
    );
  });
});
