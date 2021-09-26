import { getFilePathsMatching } from '../getFilePathsMatching';

const FIXTURES_BASE_DIR = `${__dirname}/fixtures/getFilePathMatchingFixtures/`;

describe('getFilePathsMatching', function () {
    it('should rejects if working directory is not found', function () {
        const cwd = '/not_an_existing_directory';
        expect(getFilePathsMatching(/a regex/, cwd)).rejects.toStrictEqual('Argument workingDir should be an existing directory.');
    });

    it('should rejects if working directory is a file', function () {
        expect(getFilePathsMatching(/a regex/, FIXTURES_BASE_DIR + 'not_a_directory.txt')).rejects.toStrictEqual('Argument workingDir should be an existing directory.');
    });

    it('should should not look in subdirectory', function () {
        expect(getFilePathsMatching(/.*/, FIXTURES_BASE_DIR)).resolves.toStrictEqual(['not_a_directory.txt']);
    });

    it('should only return files matching regex', function () {
        expect(getFilePathsMatching(/\.tsx?/, FIXTURES_BASE_DIR)).resolves.toStrictEqual(['index.ts', 'Component.tsx']);
    });
});