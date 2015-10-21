/**
 * simple.js - simple test
 * @author Yaroslav Pogrebnyak <yyyaroslav@gmail.com>
 */

var _ = require('lodash'),
    getConfig = require('../lib').getConfig;

var configsDir = __dirname + '/configs';

/* exports */
module.exports = {

    'Simple config': function(test) {
        var config = getConfig(configsDir + '/default.js');
        test.equal(config.hello, 'world', "Key exsits in config");
        test.done();
    },

    'Config file overrides': function(test) {
        process.env.CONFIG_PATH = configsDir + '/override.json';

        var config = getConfig(configsDir + '/default.js');
        test.equal(config.hello, 'overrided', "Key is overrided in config");
        test.done();
    },

    'Config file and env overrides': function(test) {
        process.env.CONFIG_PATH = configsDir + '/override.json';
        process.env.CONFIG_another_stuff = "cool";

        var config = getConfig(configsDir + '/default.js');
        test.equal(config.hello, 'overrided', "Key overrided in config");
        test.equal(config.another.stuff, 'cool', "Key added in config from env variable");
        test.done();
    },

    'Placeholders work': function(test) {
        process.env.CONFIG_PATH = configsDir + '/placeholders.json';

        var config = getConfig(configsDir + '/default.js');
        test.equal(config.phrase, config.some.object, "Placeholder works");
        test.equal(config.phraseDuplicated, config.some.object + config.some.object, "Duplicaterd placeholder works");
        test.done();
    },

    'Relative placeholders': function(test) {
        process.env.CONFIG_PATH = null;
          var config = getConfig(configsDir + '/relativePlaceholders.json');
        test.equal(config.guys.person.phrase, "Hello, " + config.guys.person.name + " and " + config.guys.buddy.name,
                "Placeholder works");
        test.done();
    },

    'Array replacenent': function(test) {
        process.env.CONFIG_PATH = configsDir + '/arrayOverride.json';

        var config = getConfig(configsDir + '/array.json', {replaceArrays: true});
        test.deepEqual(config.array, require(configsDir+'/arrayOverride').array, "Array is replaced in config");
        test.done();
    },

};
