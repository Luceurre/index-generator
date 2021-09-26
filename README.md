# js-index-generator

js-index-generator is a npm package that provides a single command: `index-generator`.  
This command can be used to generate an index file in a directory containing javascript or typescript code using ESM export syntax.

## Installation

Use npm to install globally :
```
npm install -g js-index-generator
```
or locally :
```
npm install --save-dev js-index-generator
```
with yarn :
```
yarn add -D js-index-generator
```

## Usage

To generate a new `index.ts` in a directory, just run `index-generator` in the said directory.  
The flag `--overwrite` can be used to overwrite an existing `index` file.  
You can add formatting with the `--callback` option that let you run custom command on the generated `index`.  
You can see more advanced options with `--help`:
```
Usage: index-generator [options]

Options:
  -V, --version           output the version number
  -d, --directory <path>  working directory
  -v, --verbose           verbose
  --overwrite             overwrite existing index
  --jsMode                create an index.js instead of index.ts
  --eslint                run eslint on index file after generation
  --callback <command>    run COMMAND with index path as last argument
  -h, --help              display help for command
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.
## Licence

[MIT](https://choosealicense.com/licenses/mit/)