#!/usr/bin/env node

import { Command } from 'commander';
import { IndexGenerator, IndexGeneratorOptions } from './IndexGenerator';

const program = new Command('index-generator');
program
  .version('0.0.1')
  .option('-d, --directory <path>', 'working directory')
  .option('-v, --verbose', 'verbose')
  .option('--overwrite', 'overwrite existing index')
  .option('--jsMode', 'create an index.js instead of index.ts')
  .option('--eslint', 'run eslint on index file after generation')
  .option('--callback <command>', 'run COMMAND with index path as last argument')
  .parse();

const indexGenerator = new IndexGenerator(program.opts<IndexGeneratorOptions>());
indexGenerator.generateIndex().catch((error) => {
  console.error(error);
  process.exit(-1);
});
