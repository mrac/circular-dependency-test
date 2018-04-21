# circular-dependency-test

Detects circular dependencies in modules compiled with Webpack.

## install

```
npm install --save-dev circular-dependency-test
```

### Graphviz (optional)

> Only required if you want to generate visual graphs using [Graphviz](http://www.graphviz.org/).

#### Mac OS X

```
brew install graphviz || port install graphviz
```

#### Ubuntu

```
apt-get install graphviz
```

## run

If your Webpack config is in `./webpack.config.js` setup a script in `package.json` of your project:

```json
{
  "scripts": {
    "test:dependency": "circular-dependency-test"
  }
}
```

For custom webpack config path:

```json
{
  "scripts": {
    "test:dependency":
      "circular-dependency-test --config=config/my-webpack.config.js"
  }
}
```

Then run:

```
npm run test:dependency
```

## parameters

### config

Custom path to Webpack config.

```
circular-dependency-test --config=config/my-webpack.config.js
```

### exclude

Regular expression to exclude files from dependency test. By default dependencies from `node_modules` are excluded.

```regexp
circular-dependency-test --exclude='.+\.types\.ts|node_modules'
```

### image

Creates dependency graph. Default format is `gif`.

Requires [Graphviz](http://www.graphviz.org/) to be installed.

```
circular-dependency-test --image=reports/dependency-graph.gif
```

### format

Creates dependency graph in desired format.
See all formats: https://graphviz.gitlab.io/_pages/doc/info/output.html

Most common image types: `gif` `png` `svg` `jp2` `jpg` `pdf`

```
circular-dependency-test --image=reports/dependency-graph.svg --format=svg
```

### timestamp

Saves the image file with a timestamp.

```
circular-dependency-test --image=reports/dependency-graph.gif --timestamp
```

## project dependencies

* Based on [circular-dependency-plugin](https://github.com/aackerman/circular-dependency-plugin).
* Works with Webpack >=4.0.1

For creating visual graphs:

* [dependency-cruiser](https://github.com/sverweij/dependency-cruiser)
* [Graphviz](http://www.graphviz.org/)
