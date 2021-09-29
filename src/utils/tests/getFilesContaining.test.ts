import { getFilesContaining } from '../getFilesContaining';

const FIXTURES_BASE_DIR = `${__dirname}/fixtures/getFilesContainingFixtures/`;

describe('getFilesContaining', function () {
  it('should not throw an error when no file paths are given', function () {
    expect(() => getFilesContaining('', [], '.')).not.toThrow();
  });
  it('should return an empty array if no file paths are given', function () {
    expect(getFilesContaining('', [], '.')).toStrictEqual([]);
  });
  it('should only search in given file paths', function () {
    expect(getFilesContaining('A', ['A.txt', 'B.txt'], FIXTURES_BASE_DIR)).toStrictEqual(['A.txt']);
  });
  it('should allow regex search in given file paths', function () {
    expect(getFilesContaining('A|B', ['A.txt', 'B.txt', 'AandB.txt'], FIXTURES_BASE_DIR)).toStrictEqual([
      'A.txt',
      'B.txt',
      'AandB.txt',
    ]);
  });
  it('should return files not matching regex if notMatching is true', function () {
    expect(getFilesContaining('A', ['A.txt', 'B.txt', 'AandB.txt'], FIXTURES_BASE_DIR, true)).toStrictEqual([
      'B.txt',
      'AandB.txt',
    ]);
  });
});
