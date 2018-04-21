# circular-dependency-test

Detects circular dependencies in modules compiled with Webpack.

## install

```sh
npm install --save-dev circular-dependency-test
```

or globally:

```sh
npm install -g circular-dependency-test
```

### Graphviz (optional)

> Only required if you want to generate visual graphs using [Graphviz](http://www.graphviz.org/).

#### Mac OS X

```sh
brew install graphviz || port install graphviz
```

#### Ubuntu

```sh
apt-get install graphviz
```

## run

If your Webpack config is in `./webpack.config.js`, run the test from the root directory of your project:

```sh
circular-dependency-test
```

## parameters

### config

Custom path to Webpack config.

```sh
circular-dependency-test --config=config/my-webpack.config.js
```

### exclude

Sets regular expression to exclude files from dependency test. By default it is `node_modules`. To overwrite it by your custom RegExp run:

```regexp
circular-dependency-test --exclude='.+\\.types\\.ts|node_modules'
```

### image

Creates dependency graph. Default format is `gif`.

Requires [Graphviz](http://www.graphviz.org/) to be installed.

```sh
circular-dependency-test --image=reports/dependency-graph.gif
```

### format

Creates dependency graph in desired format.
See all formats: https://graphviz.gitlab.io/_pages/doc/info/output.html

Most common image types: `gif` `png` `svg` `jp2` `jpg` `pdf`

```sh
circular-dependency-test --image=reports/dependency-graph.svg --format=svg
```

### timestamp

Saves the image file with a timestamp.

```sh
circular-dependency-test --image=reports/dependency-graph.gif --timestamp
```

## project dependencies

* Based on [circular-dependency-plugin](https://github.com/aackerman/circular-dependency-plugin).
* Works with Webpack >=4.0.1

For creating visual graphs:

* [dependency-cruiser](https://github.com/sverweij/dependency-cruiser)
* [Graphviz](http://www.graphviz.org/)
