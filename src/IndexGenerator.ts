import { getFilePathsMatching, getFilesContaining } from './utils';
import { ANY_EXPORT_REGEX_STRING, EXPORT_DEFAULT_REGEX_STRING, INDEX_REGEX, DEFAULT_CONFIG } from './constants';
import path from 'path';
import { writeFile } from 'fs/promises';

type IndexGeneratorConfig = {
  verbose: boolean;
  directory: string;
  overwrite: boolean;
  ignoreFileRegexes: RegExp[];
  jsMode: boolean;
};

export type IndexGeneratorOptions = Partial<IndexGeneratorConfig>;

export class IndexGenerator {
  private config: IndexGeneratorConfig;

  constructor(options: IndexGeneratorOptions) {
    this.config = this.buildIndexGeneratorConfig(options);
  }

  public async generateIndex() {
    if ((await this.doesIndexAlreadyExists(this.config.directory)) && !this.config.overwrite) {
      console.log('index already exists. Add --overwrite to replace existing index');
      process.exit();
    }
    const sourceFiles = await this.getSourceFiles();

    const filteredFiles = this.filterIgnoredFiles(sourceFiles);
    const filesWithAnyExport = await this.extractFilesWithAnyExport(filteredFiles);
    const filesWithExportDefault = await this.extractFilesWithDefaultExport(filesWithAnyExport);
    const indexLines = this.getIndexLines(filesWithAnyExport, filesWithExportDefault);

    await this.writeIndex(indexLines);
  }

  private static getIndexLineForFileWithExportDefault(file: string): string {
    const moduleName = path.parse(file).name;
    return `export { default as ${moduleName} } from './${moduleName}'`;
  }

  private static getIndexLineForFileWithAnyExport(file: string): string {
    const moduleName = path.parse(file).name;
    return `export * from './${moduleName}';`;
  }

  private buildIndexGeneratorConfig = (options: IndexGeneratorOptions): IndexGeneratorConfig => {
    return Object.assign({}, DEFAULT_CONFIG, options);
  };

  private getSourceFiles = async () => {
    return await getFilePathsMatching(/\.tsx?/, this.config.directory);
  };

  private filterIgnoredFiles = (files: string[]) => {
    return files.filter((file) => !this.config.ignoreFileRegexes.some((regex) => regex.test(file)));
  };

  private extractFilesWithAnyExport = async (files: string[]) => {
    return getFilesContaining(ANY_EXPORT_REGEX_STRING, files, this.config.directory);
  };

  private extractFilesWithDefaultExport = async (files: string[]) => {
    return getFilesContaining(EXPORT_DEFAULT_REGEX_STRING, files, this.config.directory);
  };

  private doesIndexAlreadyExists = async (cwd: string) => {
    return (await getFilePathsMatching(INDEX_REGEX, cwd)).length > 0;
  };

  private getIndexLines(filesWithAnyExport: string[], filesWithExportDefault: string[]) {
    const indexLines: string[] = [];
    filesWithAnyExport.forEach((file) => indexLines.push(IndexGenerator.getIndexLineForFileWithAnyExport(file)));
    filesWithExportDefault.forEach((file) =>
      indexLines.push(IndexGenerator.getIndexLineForFileWithExportDefault(file)),
    );

    return indexLines;
  }

  private async writeIndex(indexLines: string[]) {
    const indexString = indexLines.join('\n');
    const indexPath = path.join(this.config.directory, this.getIndexFilename());
    await writeFile(indexPath, indexString);
  }

  private getIndexFilename() {
    return 'index.' + this.config.jsMode ? 'js' : 'ts';
  }
}
