/**
 * Absolute Web Services Intellectual Property
 *
 * @category     {development/deployment}
 * @copyright    Copyright © 1999-2020 Absolute Web Services, Inc. (http://www.absolutewebservices.com)
 * @author       Absolute Web Services
 * @license      http://www.absolutewebservices.com/license-agreement/  Single domain license
 * @terms of use http://www.absolutewebservices.com/terms-of-use/
 */

const PluginError = require('plugin-error');
const penthouse = require('penthouse');
const through = require('through2');

module.exports = options => {
    options = Object.assign(
        {
            userAgent: 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'
        },
        options || {}
    );

    let buildCriticalCss = (file, enc, cb) => {
        if (!file || !file.contents) {
            return cb(null, file);
        }

        if (file.isStream()) {
            console.error(new PluginError('penthouse', 'Streaming not supported!'));

            return cb(null, file);
        }

        options['css'] = file.path;

        return penthouse(options, (err, criticalCss) => {
            if (err) {
                throw err;
            }

            file.contents = Buffer.from(criticalCss);

            if (file.base.charAt(file.base.length - 1) === '/') {
                file.path = `${file.base}${options.out}`;
            } else {
                file.path = `${file.base}/${options.out}`;
            }

            cb(null, file);
        });
    };

    return through.obj(buildCriticalCss);
};
