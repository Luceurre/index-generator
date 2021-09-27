#!/usr/bin/env node

import { Command } from 'commander';
import { IndexGenerator, IndexGeneratorOptions } from './IndexGenerator';
const version = require('../package.json').version;

const program = new Command('index-generator');
program
  .version(version)
  .option('-d, --directory <path>', 'working directory')
  .option('-v, --verbose', 'verbose')
  .option('--overwrite', 'overwrite existing index')
  .option('--jsMode', 'create an index.js instead of index.ts')
  .option('--eslint', 'run eslint on index file after generation')
  .option('--callback <command>', 'run COMMAND with index path as last argument')
  .option('-s, --reexportSubmodules', 'treats directories with index file as ts/js file')
  .parse();

const indexGenerator = new IndexGenerator(program.opts<IndexGeneratorOptions>());
indexGenerator.generateIndex().catch((error) => {
  console.error(error);
  process.exit(-1);
});
