## config-getter

[![Build Status](https://travis-ci.org/yyyar/config-getter.svg?branch=master)](https://travis-ci.org/yyyar/config-getter) [![NPM version](https://badge.fury.io/js/config-getter.svg)](http://badge.fury.io/js/config-getter)

Simple json configuration reader with file and env variables overrides.
Can fetch / override variables using:
- Local file
- Env variables
- Consul key-value

For 0.0.x versions documentation see [older README.md](https://github.com/yyyar/config-getter/blob/v0.0.7/README.md)

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
const getConfig = require('config-getter').getConfig;

//
// Obtain final configuration object.
//
// Important Notice: even that underlying fetchers use async IO,
// interface to getConfig is sync for usability purposes. 
// As a result, Application that use config-getter should do getConfig once at startup time.
//
let config = getConfig(__dirname + '/default.js', {

    /* ----- optional parameters ----- */

    // if true, replaces arrays values
    // If false, merge arrays
    replaceArrays: false,

    // if true, replaces objects values
    // If false, merge objects
    replaceObjects: false,

    // If true, ignore fetcher exceptions and continue work
    // If false, throw/propagate all exceptions
    ignoreFailedFetchers: false,

    // Optional fetchers
    // Values from these fetchers will be merged into default config
    // in order of their appear in the following array:
    fetchers: [

        /* ----- one or more of the following ----- */

        {
            type: 'consul',
            opts: {
                baseUrl: 'http://localhost:8500/v1',  // base url for Consul REST API
                key: 'config'                         // key to look for JSON value
            }
        },

        {
            type: 'file',
            opts: {
                path: process.env.PATH_TO_CONFIG       // path to json file
            }
        },

        {
            type: 'env',
            opts: {
                prefix: 'CONFIG_',                    // prefix of env variable used to override values
                ignore: '^PATH_TO_CONFIG$'            // regexp to ignore env variable if there is a match
            }
        }
    ]

});

console.log(config);

```

Simple config loading
```bash
$ node app.js
```

Override config with overrides.json values
```bash
$ PATH_TO_CONFIG=./overrides.json node app.js
```

Override config with overrides.json values and single key value
```bash
$ PATH_TO_CONFIG=./overrides.json CONFIG_db_port=7777 node app.js
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

