import { IGNORE_FILE_REGEXES } from './regex';

export const DEFAULT_CONFIG = {
  verbose: false,
  directory: '.',
  overwrite: false,
  ignoreFileRegexes: IGNORE_FILE_REGEXES,
  jsMode: false,
};
