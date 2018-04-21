# circular-dependency-test
Detects circular dependencies in modules compiled with Webpack.

# dependencies

* Based on [circular-dependency-plugin](https://github.com/aackerman/circular-dependency-plugin).
* Works with Webpack >=4.0.1

# install

```
npm install --save-dev git+https://github.com/mrac/circular-dependency-test
```

# run

If your Webpack config is in `./webpack.config.js` setup a script in `package.json` of your project:

```json
{
    "scripts": {
        "dependency-test": "circular-dependency-test"
    } 
}
```

For custom webpack config path:

```json
{
    "scripts": {
        "dependency-test": "circular-dependency-test --config=config/my-webpack.config.js"
    } 
}
```

Then run:

```
npm run dependency-test
```

# exclude files

By default dependencies from `node_modules` are excluded.

For custom excluding use regular expression:

```json
{
    "scripts": {
        "dependency-test": "circular-dependency-test --exclude='.+\.types\.ts|node_modules'"
    } 
}
```
