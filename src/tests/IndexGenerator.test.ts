import { IndexGenerator } from '../IndexGenerator';
import path from 'path';
import { readdir, readFile, unlink, writeFile } from 'fs/promises';
import { accessSync } from 'fs';

const FIXTURES_BASE_DIR = `${__dirname}/fixtures/`;

describe('IndexGenerator', function () {
  const generateEmptyIndex = async (directory: string) => {
    await writeFile(path.join(directory, 'index.ts'), '');
    const file = await readFile(path.join(directory, 'index.ts'));
    expect(file.toString().trim()).toStrictEqual('');
  };
  const deleteIndex = async (directory: string) => {
    await unlink(path.join(directory, 'index.ts')).catch(() => {});
    await unlink(path.join(directory, 'index.js')).catch(() => {});
  };
  it('should not generate empty index', async function () {
    const directory = path.join(FIXTURES_BASE_DIR, 'empty_directory');
    const indexGenerator = new IndexGenerator({ directory });
    await expect(async () => await indexGenerator.generateIndex()).not.toThrow();
    expect((await readdir(directory)).length).toStrictEqual(0);
  });
  it('should not overwrite index by default', async function () {
    const directory = path.join(FIXTURES_BASE_DIR, 'directory_with_files');
    await generateEmptyIndex(directory);
    const indexGenerator = new IndexGenerator({ directory });
    jest.spyOn(process, 'exit').mockImplementation();

    await expect(async () => await indexGenerator.generateIndex()).not.toThrow();

    const file = await readFile(path.join(directory, 'index.ts'));
    expect(file.toString().trim()).toStrictEqual('');
  });
  it('should overwrite index if specified', async function () {
    const directory = path.join(FIXTURES_BASE_DIR, 'directory_with_files');
    await generateEmptyIndex(directory);
    const indexGenerator = new IndexGenerator({ directory, overwrite: true });
    await indexGenerator.generateIndex();

    const resultFile = await readFile(path.join(directory, 'index.ts'));
    expect(resultFile.toString().trim()).toStrictEqual(
      "export * from './Component';\nexport { default as Component } from './Component';",
    );
  });
  it('should generate index', async function () {
    const directory = path.join(FIXTURES_BASE_DIR, 'directory_with_files');
    await deleteIndex(directory);

    const indexGenerator = new IndexGenerator({ directory, overwrite: true });
    await indexGenerator.generateIndex();

    const resultFile = await readFile(path.join(directory, 'index.ts'));
    expect(resultFile.toString().trim()).toStrictEqual(
      "export * from './Component';\nexport { default as Component } from './Component';",
    );
  });
  it('should generate index.js if jsMode is true', async function () {
    const directory = path.join(FIXTURES_BASE_DIR, 'directory_with_files');
    await deleteIndex(directory);

    const indexGenerator = new IndexGenerator({ directory, overwrite: true, jsMode: true });
    await indexGenerator.generateIndex();

    const resultFile = await readFile(path.join(directory, 'index.js'));
    expect(resultFile.toString().trim()).toStrictEqual(
      "export * from './Component';\nexport { default as Component } from './Component';",
    );
  });
  it('should call callback function after generation', async function () {
    const directory = path.join(FIXTURES_BASE_DIR, 'directory_with_files');
    await deleteIndex(directory);

    const indexGenerator = new IndexGenerator({ directory, overwrite: true, callback: 'rm' });
    await indexGenerator.generateIndex();

    await expect(async () => {
      return accessSync(path.join(directory, 'index.ts'));
    }).rejects.toBeDefined();
  });
});
