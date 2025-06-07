import { connect } from 'mongoose';
import { env } from '../config/env';
import { Logger } from '../utils/logger';
import { Container } from 'typedi';
import userModel from '../models/userModel';

export async function mongoLoader(): Promise<void> {
  Logger.info('Connecting to database...');

  await connect(env.db.uri as string);

  Container.set('userModel', userModel);
}
