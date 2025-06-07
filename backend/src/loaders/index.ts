import { serverLoader } from './server';
import { mongoLoader } from './db';

export const appLoader = async () => {
  await mongoLoader();
  serverLoader();
};
