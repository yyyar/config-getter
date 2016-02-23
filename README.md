## config-getter

[![Build Status](https://travis-ci.org/yyyar/config-getter.svg?branch=master)](https://travis-ci.org/yyyar/config-getter) [![NPM version](https://badge.fury.io/js/config-getter.svg)](http://badge.fury.io/js/config-getter)

Simple json configuration reader with file and env variables overrides.

### Installation
```bash
$ npm install config-getter
```

### Usage

`default.js`
```javascript
module.exports = {
    "db": {
        "host": "localhost",
        "port": "12345"
    }
}
```

`overrides.json`
```javascript
{
    "db": {
        "host": "google.com"
    }
}
```

`app.js`
```javascript
var getConfig = require('config-getter').getConfig;

var config = getConfig(__dirname + '/default.js', {
    /* optional parameters */

    // Name of env variables with path to extend default config file
    configEnvVar: 'CONFIG_PATH',

    // Prefix for replacing config variables from env vars
    configEnvPrefix: 'CONFIG_',

    // if true, replaces arrays values, otherwise merge them
    replaceArrays: false 
});
console.log(config);
```

Simple config loading
```bash
$ node app.js
```

Override config with overrides.json values
```bash
$ CONFIG_PATH=./overrides.json node app.js
```

Override config with overrides.json values and single key value
```bash
$ CONFIG_PATH=./overrides.json CONFIG_db_port=7777 node app.js
```

### Placeholders
It's possible to make a reference to previous defined value in some config string value:
```json
{
   "who": "world",
   "phrase": "hello, $(who)!"
}
```
So phrase will become "hello, world!". It is possbile to make reference in inner objects too:
```json
"$(some.obj.value)"
```

Placeholders also may be relative. Currently the same level, and parent level are supported.
```javascript
{
    "a": {
        "a1": {
            "name": "Vasya",
            "phrase": "My name is $(.name)" // link to the same level var starts with single dot '.'
       },
       "a2": {
           "name": "$(..a1.name)" // link to upper level var starts with two dots '..'
       }
    }
}
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

