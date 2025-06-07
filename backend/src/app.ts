import 'reflect-metadata';
import 'es6-shim';

import { Logger } from './utils/logger';

process.on('unhandledRejection', (err: Error, promise: Promise<unknown>) => {
  Logger.error(err);
  Logger.error(promise);
  process.exit(1);
});
