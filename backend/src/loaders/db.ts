import mongoose from 'mongoose';
import { env } from '../config/env';
import { Container } from 'typedi';
import userModel from '../models/userModel';

export async function mongoLoader(): Promise<void> {
  console.log('Connecting to database...');
  const db = mongoose.connection;
  db.once('open', () => {
    console.log('Database connected!');
  });
  await mongoose.connect(env.db.uri as string);
  Container.set('userModel', userModel);
}
