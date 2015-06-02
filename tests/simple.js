/**
 * simple.js - simple test
 * @author Yaroslav Pogrebnyak <yyyaroslav@gmail.com>
 */

var _ = require('lodash'),
    getConfig = require('../lib').getConfig;

/* exports */
module.exports = {

    'Simple config': function(test) {
        var config = getConfig(__dirname + '/default.js');
        test.equal(config.hello, 'world', "Key exsits in config");
        test.done();
    },

    'Config file overrides': function(test) {
        process.env.CONFIG_PATH = __dirname + '/override.json';

        var config = getConfig(__dirname + '/default.js');
        test.equal(config.hello, 'overrided', "Key is overrided in config");
        test.done();
    },

    'Config file and env overrides': function(test) {
        process.env.CONFIG_PATH = __dirname + '/override.json';
        process.env.CONFIG_another_stuff = "cool";

        var config = getConfig(__dirname + '/default.js');
        test.equal(config.hello, 'overrided', "Key overrided in config");
        test.equal(config.another.stuff, 'cool', "Key added in config from env variable");
        test.done();
    },

    'Placeholders work': function(test) {
        process.env.CONFIG_PATH = __dirname + '/placeholders.json';

        var config = getConfig(__dirname + '/default.js');
        test.equal(config.phrase, config.some.object, "Placeholder works");
        test.done();
    }

};
