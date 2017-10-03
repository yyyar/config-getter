/*
 * config.js - Configuration with overrides
 *
 * The order of loading config is the following:
 *
 * - config is loaded from defaultPath
 *
 * - configs from all configured fetchers will be merged with base config
 *   in order of their definition in opts.fetchers
 *
 * @author Yaroslav Pogrebnyak <yyyaroslav@gmail.com>
 */

const _ = require('lodash');

/* module exports */
module.exports = {

    /**
     * Reads config, overriding it if needed
     */
    getConfig: function(defaultPath, opts) {

        if (!defaultPath) {
            throw new Error("defaultPath not provided");
        }

        /* ----- Load default config ----- */

        let config = require(defaultPath);

        /* ----- Constants and variables ----- */

        opts = _.merge({

            replaceArrays: false,
            replaceObjects: false,
            ignoreFailedFetchers: false,

            fetchers: [
                /*
                  {
                     type: '<fetcher>',
                     opts: {
                          // params
                     }
                  },
                   ...
                */
            ],

        }, opts);


        /* ----- Process chain of additional fetchers ----- */

        for (let cfg of opts.fetchers) {

            if (_.isEmpty(cfg)) {
                continue;
            }

            let fetcher = require(__dirname + '/fetchers/' + cfg.type);

            try {
                console.log('Processing', cfg.type, 'fetcher:', _.values(cfg.opts).join(', '));
                merge(config, fetcher(cfg.opts), opts.replaceArrays, opts.replaceObjects);
            } catch(e) {
                if (opts.ignoreFailedFetchers) {
                    console.log('Ignoring failed fetcher: ', cfg.type + ' : ' + e.message);
                } else {
                    throw Error('Error ' + cfg.type + ': ' + e.message); 
                }
            }
        }

        /* ----- Handle overrides ----- */
        return replacePlaceholders(config, [], config);
    }
}


/**
 * Merge from to to optionally replacing arrays
 */
let merge = function(to, from, replaceArrays, replaceObjects) {
    _.mergeWith(to, from, (a, b) => {

        if (_.isArray(a) && replaceArrays) {
            return b;
        }

        if (_.isObject(a) && replaceObjects) {
            return b;
        }
    });
}

/**
 * Map placeholders/links in config values
 */
let replacePlaceholders = function(original, parent, obj) {

    if (_.isString(obj)) {
        return obj.replace(/\$\(.*?\)/g, (match) => {
            let opt = match.slice(2, -1);

            // relative links to upper levels
            for (let placeholder of ['..', '.']) {

                let size = _.size(placeholder);
                if (opt.slice(0, size) == placeholder) {
                    return _.get(original, parent.slice(0, -size).concat([opt.slice(size)]).join('.'));
                }
            }

            return _.get(original, opt);
        })
    }

    if (_.isArray(obj)) {
        return _.map(obj, (v) => {
            return replacePlaceholders(original, parent, v);
        });
    }

    if (_.isObject(obj)) {
        return _.mapValues(obj, (v, k) => {
            return replacePlaceholders(original, parent.concat([k]), v);
        });
    }

    return obj;
}

