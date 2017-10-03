/*
 * consul.js - Consul config fetcher
 *
 * @author Yaroslav Pogrebnyak <yyyaroslav@gmail.com>
 */

const _ = require('lodash'),
      Consul = require('consul'),
      deasync = require('deasync');

/**
 * module.exports
 *
 * make sync function from async
 */
module.exports = deasync((opts, callback) => {

    let consul = Consul({
        baseUrl: opts.baseUrl
    });

    consul.kv.get(opts.key, (err, result) => {

        if (err) {
            return callback(err);
        }

        if (!result) {
            return callback(new Error('Value in consul ' + opts.baseUrl + ' is empty for key: ' + opts.key));
        }

        try {
            return callback(null, JSON.parse(result.Value));
        } catch (e) {
            callback(e);
        }

    });
})

