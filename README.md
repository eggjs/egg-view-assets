# egg-view-assets

[![NPM version][npm-image]][npm-url]
[![Node.js CI](https://github.com/eggjs/egg-view-assets/actions/workflows/nodejs.yml/badge.svg)](https://github.com/eggjs/egg-view-assets/actions/workflows/nodejs.yml)
[![Test coverage][codecov-image]][codecov-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/egg-view-assets.svg?style=flat-square
[npm-url]: https://npmjs.org/package/egg-view-assets
[codecov-image]: https://img.shields.io/codecov/c/github/eggjs/egg-view-assets.svg?style=flat-square
[codecov-url]: https://codecov.io/github/eggjs/egg-view-assets?branch=master
[download-image]: https://img.shields.io/npm/dm/egg-view-assets.svg?style=flat-square
[download-url]: https://npmjs.org/package/egg-view-assets

Manage frontend assets in development and production.

## Install

```bash
$ npm i egg-view-assets --save
```

## Usage

Add `egg-view-assets` as plugin

```js
// {app_root}/config/plugin.js
exports.assets = {
  enable: true,
  package: 'egg-view-assets',
};
```

Configuration, you can see full example in [egg-ant-design-pro].

```js
// {app_root}/config/config.default.js
exports.view = {
  mapping: {
    '.js': 'assets',
  },
};

exports.assets = {
  devServer: {
    command: 'roadhog dev',
    port: 8000,
  },
};
```

See [config/config.default.js](config/config.default.js) for more detail.

## Questions & Suggestions

Please open an issue [here](https://github.com/eggjs/egg/issues).

## License

[MIT](LICENSE)

[egg-ant-design-pro]: https://github.com/eggjs/egg-ant-design-pro
