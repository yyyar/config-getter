/**
 * simple.js - simple test
 * @author Yaroslav Pogrebnyak <yyyaroslav@gmail.com>
 */

const _ = require('lodash'),
      getConfig = require('../lib').getConfig;

const configsDir = __dirname + '/configs';

/* exports */
module.exports = {

    setUp: function(callback) {
        process.env = _.dropWhile(process.env, (o) => { return o.startsWith('CG_'); });
        callback();
    },

    'Simple config': function(test) {
        let config = getConfig(configsDir + '/default.js');
        test.equal(config.hello, 'world', "Key exsits in config");
        test.done();
    },

    'Config file overrides': function(test) {

        let config = getConfig(configsDir + '/default.js', {
            fetchers: [
                {
                    type: 'file',
                    opts: {
                        path: configsDir + '/override.json'
                    }
                }
            ]
        });

        test.equal(config.hello, 'overrided', "Key is overrided in config");
        test.done();
    },

    'Config file and env overrides': function(test) {

        process.env.CG_ENV_another_stuff = 'cool';

        let config = getConfig(configsDir + '/default.js', {
            fetchers: [
                {
                    type: 'file',
                    opts: {
                        path: configsDir + '/override.json'
                    }
                },
                {
                    type: 'env',
                    opts: {
                        prefix: 'CG_ENV_'
                    }
                }
            ]
        });

        test.equal(config.hello, 'overrided', "Key overrided in config");
        test.equal(config.another.stuff, 'cool', "Key added in config from env variable");
        test.done();
    },

    'Placeholders work': function(test) {

        let config = getConfig(configsDir + '/default.js', {
            fetchers: [
                {
                    type: 'file',
                    opts: {
                        path: configsDir + '/placeholders.json'
                    }
                }
            ]
        });

        test.equal(config.phrase, config.some.object, "Placeholder works");
        test.equal(config.phraseDuplicated, config.some.object + config.some.object, "Duplicaterd placeholder works");
        test.done();
    },

    'Relative placeholders': function(test) {
        let config = getConfig(configsDir + '/relativePlaceholders.json');
        test.equal(config.guys.person.phrase, "Hello, " + config.guys.person.name + " and " + config.guys.buddy.name,
                "Placeholder works");
        test.done();
    },

    'Array replacement': function(test) {

        let config = getConfig(configsDir + '/array.json', {
            replaceArrays: true,
            fetchers: [
                {
                    type: 'file',
                    opts: {
                        path: configsDir + '/arrayOverride.json'
                    }
                }
            ]
        });
        test.deepEqual(config.array, require(configsDir+'/arrayOverride').array, "Array is replaced in config");
        test.done();
    },

    'Broken override file throws exception': function(test) {

        test.throws(() => {
            let x = getConfig(configsDir + '/default.js', {
                fetchers: [
                    {
                        type: 'file',
                        opts: {
                            path: configsDir + '/broken.json'
                        }
                    }
                ]
            });
        }, Error, 'Throws exception');

        test.done();
    },

    /*
    'Consul': function(test) {

        let config = getConfig(configsDir + '/default.js', {
            replaceArrays: true,
            fetchers: [
                {
                    type: 'consul',
                    opts: {
                        baseUrl: 'http://localhost:8500/v1',
                        key: 'test/config'
                    }
                }
            ]
        });

        test.equal(config.consul, 'fromconsul', "Value from consul presented");

        test.done();
    }
    */

};

