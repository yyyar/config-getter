/*
 * config.js - Configuration with overrides
 *
 * The order of loading config is the following:
 *
 * 1. Config is loaded from defaultPath
 *
 * 2. Contents of json file is merged, if "opts.configEnvVar" variable exists
 *    and points to a valid json file.
 *
 * 3. Environment variables with prefix "opts.configEnvPrefix" and '.' as path separator are
 *    used for overriding, if any. Example: CONFIG_mongo_host=127.0.0.1.
 *
 * @author Yaroslav Pogrebnyak <yyyaroslav@gmail.com>
 */

var _ = require('lodash'),
    dotty = require('dotty');


/**
 * Map placeholders/links in config values
 */
var replacePlaceholders = function(original, parent, obj) {

    if (_.isString(obj)) {
        return obj.replace(/\$\(.*?\)/g, function(m) {
            var opt = m.slice(2, -1);

            // TODO: Refactor to get rid of code duplication

            // relative link to upper level
            if (opt.slice(0, 2) == '..') {
               var ref = parent.slice(0,-2).concat([opt.slice(2)]).join('.');
               return dotty.get(original, ref);
            }

            // relative link to the same level
            if (opt.slice(0, 1) == '.') {
                var ref = parent.slice(0,-1).concat([opt.slice(1)]).join('.');
                return dotty.get(original, ref);
            }

            return dotty.get(original, opt);
        })
    }

    if (_.isArray(obj)) {
        return _.map(obj, function(v) {
            return replacePlaceholders(original, parent, v);
        });
    }

    if (_.isObject(obj)) {
        return _.mapValues(obj, function(v, k) {
            return replacePlaceholders(original, parent.concat([k]), v);
        });
    }

    return obj;
}


/* module exports */

module.exports = {

    /**
     * Reads config, overriding it if needed
     */
    getConfig: function(defaultPath, opts) {

        if (!defaultPath) {
            throw new Error("defaultPath not provided");
        }

        /* Constants and variables */

        var opts = _.merge({
            configEnvVar: 'CONFIG_PATH',
            configEnvPrefix: 'CONFIG_'
        }, opts);

        var localConfigFile = process.env[opts.configEnvVar];

        /* Load default config */

        var config = this.defaultConfig = require(defaultPath);

        /* Merge local config to default */

        if (localConfigFile) {
            try {
                config = _.merge(config, require(localConfigFile));
            } catch(e) {
                console.log(opts.configEnvVar, ' points to unexisting file ', localConfigFile, 'skipping...');
            }
        }

        /* Pick only our variables (with right prefix) */

        var vars = _.pick(process.env, function(v, k) {
            return k.indexOf(opts.configEnvPrefix) == 0 && k !== opts.configEnvVar;
        });

        /* Convert to dotted-notation and set to config */
        _.each(vars, function(v, k) {
            k = k.replace(opts.configEnvPrefix, '');
            k = k.replace(/_/g, '.');
            dotty.put(config, k, v);
        });

        return replacePlaceholders(config, [], config);
    }
}



