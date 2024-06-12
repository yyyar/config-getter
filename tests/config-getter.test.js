const _ = require('lodash');
const getConfig = require('../lib').getConfig;

const configsDir = __dirname + '/configs';

beforeEach(() => {
    process.env = _.omitBy(process.env, (value, key) => key.startsWith('CG_'));
});

test('Simple config', () => {
    let config = getConfig(configsDir + '/default.js');
    expect(config.hello).toBe('world');
});

test('Config file overrides', () => {
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
    expect(config.hello).toBe('overrided');
});

test('Config file and env overrides', () => {
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

    expect(config.hello).toBe('overrided');
    expect(config.another.stuff).toBe('cool');
});

test('Placeholders work', () => {
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

    expect(config.phrase).toBe(config.some.object);
    expect(config.phraseDuplicated).toBe(config.some.object + config.some.object);
});

test('Relative placeholders', () => {
    let config = getConfig(configsDir + '/relativePlaceholders.json');
    expect(config.guys.person.phrase).toBe("Hello, " + config.guys.person.name + " and " + config.guys.buddy.name);
});

test('Array replacement', () => {
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
    expect(config.array).toEqual(require(configsDir + '/arrayOverride').array);
});

test('Broken override file throws exception', () => {
    expect(() => {
        getConfig(configsDir + '/default.js', {
            fetchers: [
                {
                    type: 'file',
                    opts: {
                        path: configsDir + '/broken.json'
                    }
                }
            ]
        });
    }).toThrow(Error);
});

/*
test('Consul', () => {
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

    expect(config.consul).toBe('fromconsul');
});
*/

