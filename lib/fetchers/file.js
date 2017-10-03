/*
 * file.js - File config fetcher
 *
 * @author Yaroslav Pogrebnyak <yyyaroslav@gmail.com>
 */

const _ = require('lodash');

/**
 * module.exports
 * 
 * Fetch config from file
 */
module.exports = (opts) => {
    return require(opts.path);
};

