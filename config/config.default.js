'use strict';

const path = require('path');

module.exports = (appInfo, appConfig) => {
  const config = {};

  /**
   * egg-opentracing default config
   * @member Config#opentracing
   * @property {Array<String | RegExp>} pathIgnores - ignore path trace
   * @property {Object}  spanDecorate - decorate span
   * @property {String} globalTracer - override the default Tracer
   * @property {Object} carrier - the map of carriers
   * @property {Object} collector - the map of collectors
   */
  config.opentracing = {
    pathIgnores: [],
    spanDecorate: {
      in(span, ctx){},
      out(span, ctx){}
    },
    globalTracer: require('../lib/tracer'),
    carrier: {
      HTTP: require('../lib/carrier/http_carrier'),
    },
    collector: {
      log: require('../lib/collector/log_collector'),
    },
  };

  const isLogCollectorDisabled = checkDisableLogCollector(appConfig);

  if (!isLogCollectorDisabled) {
    config.customLogger = {
      opentracingLogger: {
        file: path.join(appInfo.root, 'logs', appInfo.name, 'opentracing.log'),
        consoleLevel: 'NONE',
      },
    };
  }

  return config;
};

function checkDisableLogCollector(appConfig) {
  /* istanbul ignore if */
  if (!appConfig.opentracing) return false;
  if (!appConfig.opentracing.collector) return false;
  return appConfig.opentracing.collector.log === false;
}
