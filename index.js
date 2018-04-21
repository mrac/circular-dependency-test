#!/usr/bin/env node

const webpack = require('webpack');
const CircularDependencyPlugin = require('circular-dependency-plugin');

const args = parseArgs(process.argv);
const webpackConfigPath = args.config || 'webpack.config.js';
const excludeRegExp = new RegExp(args.exclude || 'node_modules');

const cwd = process.cwd();
const webpackConfig = require(cwd + '/' + webpackConfigPath);

runWebpack(webpackConfig);

function runWebpack(webpackConfig) {
  webpack(config(webpackConfig)).run((err, stats) => {
    if (err || stats.hasErrors()) {
      const fileMap = {};
      const errors = stats.toJson().errors;
      let fileCount;

      errors.forEach(error => {
        const files = error.replace('Circular dependency detected:', '').split(' -> ');
        files.forEach(file => {
          fileMap[file] = (fileMap[file] || 0) + 1;
        });
        console.log('');
        console.log('\x1b[31m%s\x1b[0m', error);
      });

      fileCount = Object.keys(fileMap).length;

      console.log('');
      console.log('\x1b[31m%s\x1b[0m', `DETECTED ${errors.length} CIRCULAR-DEPENDENCY ISSUES.`);
      console.log('\x1b[31m%s\x1b[0m', `INVOLVED ${fileCount} FILES.`);
      console.log('');
      process.exit(1);
    } else {
      console.log('');
      console.log('\x1b[32m%s\x1b[0m', 'No circular dependencies detected.');
      console.log('');
    }
  });
}

function config(webpackConfig) {
  return {
    ...webpackConfig,
    plugins: [
      ...webpackConfig.plugins,
      new CircularDependencyPlugin({
        exclude: excludeRegExp,
        failOnError: true,
        cwd
      })
    ]
  };
}

function parseArgs(argv) {
  const args = {};
  argv.forEach(arg => {
    const match = arg.match(/--?([^=]+)(=(.*))?/);
    if (match) {
      const key = match[1];
      const value = match[3];
      args[key] = value;
    }
  });
  return args;
}
