import { getDirectoriesContaining, getFilePathsMatching, getFilesContaining } from './utils';
import {
  ANY_EXPORT_REGEX_STRING,
  DEFAULT_CONFIG,
  EXPORT_DEFAULT_REGEX_STRING,
  INDEX_REGEX,
  TS_JS_FILE_REGEX,
} from './constants';
import path from 'path';
import { writeFile } from 'fs/promises';
import { execSync } from 'child_process';

type IndexGeneratorConfig = {
  verbose: boolean;
  directory: string;
  overwrite: boolean;
  ignoreFileRegexes: RegExp[];
  jsMode: boolean;
  eslint: boolean;
  callback?: string;
  reexportSubmodules: boolean;
  recursive: boolean;
  git: boolean;
};

export type IndexGeneratorOptions = Partial<IndexGeneratorConfig>;

export class IndexGenerator {
  private readonly config: IndexGeneratorConfig;

  constructor(options: IndexGeneratorOptions) {
    this.config = this.buildIndexGeneratorConfig(options);
  }

  public async generateIndex(): Promise<void> {
    if (this.config.recursive) {
      const subdirectories = await getDirectoriesContaining(/.*/, this.config.directory);
      subdirectories.forEach((subdirectory) => {
        const subdirectoryIndexGenerator = new IndexGenerator({
          ...this.config,
          directory: subdirectory,
        });
        subdirectoryIndexGenerator.generateIndex();
      });
    }

    if ((await this.doesIndexAlreadyExists(this.config.directory)) && !this.config.overwrite) {
      console.log('index already exists. Add --overwrite to replace existing index');
      process.exit();

      return;
    }
    const { filesWithExportDefault, filesWithExport } = await this.extractFiles();

    if (this.config.reexportSubmodules) {
      (await this.getSubmodules()).forEach((submodule) => filesWithExport.push(submodule));
    }

    const indexLines = this.getIndexLines(filesWithExport, filesWithExportDefault);

    await this.writeIndex(indexLines);
    this.afterGenerationActions();
  }

  private afterGenerationActions() {
    if (this.config.eslint) {
      this.formatIndex();
    }
    if (this.config.callback) {
      this.executeCallback(this.config.callback, "Couldn't execute callback command.");
    }

    if (this.config.git) {
      this.addIndexToGit();
    }
  }

  private addIndexToGit() {
    this.executeCallback('git add', "Couldn't add file to git. Are you in a git repository ?");
  }

  private async extractFiles() {
    const sourceFiles = await this.getSourceFiles();
    const filteredFiles = this.filterIgnoredFiles(sourceFiles);
    const filesWithAnyExport = this.extractFilesWithAnyExport(filteredFiles);
    const filesWithExportDefault = this.extractFilesWithExportDefault(filesWithAnyExport);
    const filesWithExport = this.extractFilesWithExport(filesWithAnyExport);

    return { filesWithExportDefault, filesWithExport };
  }

  private extractFilesWithExport(filesWithAnyExport: string[]) {
    return getFilesContaining(EXPORT_DEFAULT_REGEX_STRING, filesWithAnyExport, this.config.directory, true);
  }

  private static getIndexLineForFileWithExportDefault(file: string): string {
    const moduleName = path.parse(file).name;

    return `export { default as ${moduleName} } from './${moduleName}';`;
  }

  private static getIndexLineForFileWithAnyExport(file: string): string {
    const moduleName = path.parse(file).name;

    return `export * from './${moduleName}';`;
  }

  private buildIndexGeneratorConfig = (options: IndexGeneratorOptions): IndexGeneratorConfig => {
    return Object.assign({}, DEFAULT_CONFIG, options);
  };

  private getSubmodules = async () => {
    return await getDirectoriesContaining(INDEX_REGEX, this.config.directory);
  };

  private getSourceFiles = async () => {
    return await getFilePathsMatching(TS_JS_FILE_REGEX, this.config.directory);
  };

  private filterIgnoredFiles = (files: string[]) => {
    return files.filter((file) => !this.config.ignoreFileRegexes.some((regex) => regex.test(file)));
  };

  private extractFilesWithAnyExport = (files: string[]) => {
    return getFilesContaining(ANY_EXPORT_REGEX_STRING, files, this.config.directory);
  };

  private extractFilesWithExportDefault = (files: string[]) => {
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
    if (indexLines.length === 0) return;
    const indexString = indexLines.join('\n');
    const indexPath = this.getIndexFilepath();
    await writeFile(indexPath, indexString);
  }

  private getIndexFilepath() {
    return path.join(this.config.directory, this.getIndexFilename());
  }

  private getIndexFilename() {
    return 'index.' + (this.config.jsMode ? 'js' : 'ts');
  }

  private formatIndex() {
    this.executeCallback(
      'eslint --fix',
      "Couldn't format index, are you sure that eslint is installed and available in path?",
    );
  }

  private executeCallback(command: string, error: string) {
    const callbackCommand = command + ' ' + this.getIndexFilepath();
    try {
      execSync(callbackCommand);
    } catch {
      console.error(error);
    }
  }
}
