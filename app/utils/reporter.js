'use strict';

let config;
if (process.env.NODE_ENV === 'production') {
  config = require('../../config/global.prod');
} else {
  config = require('../../config/global.dev');
}


module.exports = function reporter(middlewareOptions, options) {
  const {log, state, stats} = options;

  if (state) {
    const displayStats = (middlewareOptions.stats !== false);

    if (displayStats) {
      if (stats.hasErrors()) {
        log.error(stats.toString(middlewareOptions.stats));
      } else if (stats.hasWarnings()) {
        log.warn(stats.toString(middlewareOptions.stats));
      } else {
        log.info(stats.toString(middlewareOptions.stats));
      }
    }

    let message = 'Compiled successfully.';

    if (stats.hasErrors()) {
      message = 'Failed to compile.';
    } else if (stats.hasWarnings()) {
      message = 'Compiled with warnings.';
    }
    setTimeout(() => {
      log.info(message);
      log.info(`请访问 http://127.0.0.1:${config.port}`);
    }, 233);
  } else {
    log.info('Compiling...');
  }
};
