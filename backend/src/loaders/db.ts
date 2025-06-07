import { connect } from 'mongoose';
import { env } from '../config/env';
import { Container } from 'typedi';
import userModel from '../models/userModel';

export async function mongoLoader(): Promise<void> {
  console.log('Connecting to database...');

  await connect(env.db.uri as string);

  Container.set('userModel', userModel);
}
