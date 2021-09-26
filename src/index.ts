#!/usr/bin/env node

import { Command } from 'commander';
import { IndexGenerator, IndexGeneratorOptions } from './IndexGenerator';

const program = new Command();
program
  .version('0.0.1')
  .option('-d, --directory <path>', 'working directory')
  .option('-v, --verbose', 'verbose')
  .option('--overwrite', 'overwrite existing index')
  .option('--jsMode', 'create an index.js instead of index.ts')
  .parse();

const indexGenerator = new IndexGenerator(program.opts<IndexGeneratorOptions>());
indexGenerator.generateIndex().catch((error) => {
  console.error(error);
  process.exit(-1);
});
