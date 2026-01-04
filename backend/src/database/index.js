import Knex from 'knex';
import { Model } from 'objection';
import knexConfig from '../../knexfile.js';

const environment = process.env.NODE_ENV || 'development';
const knex = Knex(knexConfig[environment]);

export const initDatabase = async () => {
  Model.knex(knex);
  console.log('Database connected');
};

export { knex };
