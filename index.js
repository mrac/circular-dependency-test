#!/usr/bin/env node

const webpack = require("webpack");
const util = require("util");
const exec = util.promisify(require("child_process").exec);
const CircularDependencyPlugin = require("circular-dependency-plugin");
const DisableOutputWebpackPlugin = require("disable-output-webpack-plugin");

const args = parseArgs(process.argv);
const webpackConfigPath = args.config || "webpack.config.js";
const excludeRegExp = new RegExp(args.exclude || "node_modules");
const includeTimestamp = "timestamp" in args;

const cwd = process.cwd();
const webpackConfig = require(cwd + "/" + webpackConfigPath);

runWebpack(webpackConfig);

function runWebpack(webpackConfig) {
  webpack(config(webpackConfig)).run(output);
}

function config(webpackConfig) {
  return {
    ...webpackConfig,
    plugins: [
      ...webpackConfig.plugins,
      new DisableOutputWebpackPlugin(),
      new CircularDependencyPlugin({
        exclude: excludeRegExp,
        failOnError: true,
        cwd
      })
    ]
  };
}

function output(err, stats) {
  if (err || stats.hasErrors()) {
    const fileMap = {};
    const errors = stats ? stats.toJson().errors : [err];

    errors.forEach(error => {
      const files = String(error)
        .replace("Circular dependency detected:", "")
        .trim()
        .split(/ +-> +/);
      files.forEach(file => {
        fileMap[file] = (fileMap[file] || 0) + 1;
      });
      console.log("");
      console.log("\x1b[31m%s\x1b[0m", error);
    });

    const filePaths = Object.keys(fileMap);

    if (stats) {
      console.log("");
      console.log(
        "\x1b[31m%s\x1b[0m",
        `DETECTED ${errors.length} CIRCULAR-DEPENDENCY ISSUES.`
      );
      console.log("\x1b[31m%s\x1b[0m", `INVOLVED ${filePaths.length} FILES.`);
      console.log("");

      if (args.image) {
        createGraph(filePaths).then(() => {
          process.exit(1);
        });
      } else {
        process.exit(1);
      }
    } else {
      console.log("");
      process.exit(1);
    }
  } else {
    console.log("");
    console.log("\x1b[32m%s\x1b[0m", "No circular dependencies detected.");
    console.log("");
  }
}

function parseArgs(argv) {
  const args = {};
  argv.forEach(arg => {
    const match = arg.match(/^--?([^=]+)(=(.*))?$/);
    if (match) {
      const key = match[1];
      const value = match[3];
      args[key] = value;
    }
  });
  return args;
}

async function createGraph(filePaths) {
  const pathReg = filePaths.map(f => `.*${f}`.replace(/\./g, "\\.")).join("|");
  const excludeReg = `node_modules|^(?!${pathReg})([\\.A-Za-z0-9/_-]+)$`;

  const imagePath = includeTimestamp
    ? args.image.replace(
        /(\.png|\.gif|\.jpg|\.jpeg|\.jp2|\.bmp|\.svg|\.pdf)?$/,
        "-$(date +%Y%m%d-%H%M%S)$1"
      )
    : args.image;

  const imageType = args.format || "gif";
  const realImagePath = (await exec(`echo ${imagePath}`)).stdout;
  const files = filePaths.join(" ");

  const { stdout, stderr } = await exec(
    `node ./node_modules/dependency-cruiser/bin/dependency-cruise -T dot -x '${excludeReg}' ${files} | dot -T ${imageType} > ${realImagePath}`
  );

  const errorStd = stderr
    .split(/\n/)
    .filter(line => {
      return !line.match("CoreText performance note:");
    })
    .join("\n")
    .trim();

  if (errorStd) {
    console.log("Error from dependency-cruise:\n", errorStd);
  } else {
    const cyan = "\x1b[36m%s\x1b[0m";
    const graphUrl = "file://" + cwd + "/" + realImagePath;
    console.log("\nDependency graph: " + cyan, graphUrl + "\n");
  }
}
