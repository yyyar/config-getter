## config-getter

[![Build Status](https://travis-ci.org/yyyar/config-getter.svg?branch=master)](https://travis-ci.org/yyyar/config-getter) [![NPM version](https://badge.fury.io/js/config-getter.svg)](http://badge.fury.io/js/config-getter)

Simple json configuration reader with file and env variables overrides.

### Installation
```bash
$ npm install config-getter
```

### Usage

default.js
```javascript
module.exports = {
    "db": {
        "host": "localhost",
        "port": "12345"
    }
}
```

overrides.json
```javascript
{
    "db": {
        "host": "google.com"
    }
}
```

app.js
```javascript
var getConfig = require('config-getter').getConfig;

var config = getConfig(__dirname + '/default.js');
console.log(config);
```

Simple config loading
```
$ node app.js
```

Override config with overrides.json values
```
$ CONFIG=./overrides.json node app.js
```

Override config with overrides.json values and single key value
```
$ CONFIG=./overrides.json CONFIG_db_port=7777 node app.js
```

#### Tests
```bash
$ sudo npm install nodeunit -g
$ npm test
```

#### Author
* [Yaroslav Pogrebnyak](https://github.com/yyyar/)

#### License
MIT

