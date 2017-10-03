/*
 * env.js - Env variables config fetcher
 *
 * @author Yaroslav Pogrebnyak <yyyaroslav@gmail.com>
 */

const _ = require('lodash');

/**
 * module.exports
 *
 * Fetch config from Env variables
 */
module.exports = (opts) => {

    let obj = {};

    /* Pick only our variables (with right prefix) */
    let vars = _.pickBy(process.env, (v, k) => {
        return k.indexOf(opts.prefix) == 0 && (!opts.ignore || !k.match(opts.ignore));
    });

    /* Convert to dotted-notation and set to obj */
    _.each(vars, (v, k) => {
        k = k.replace(opts.prefix, '');
        k = k.replace(/_/g, '.');
        _.set(obj, k, v);
    });

    return obj;
}

