import { FindOptionsSelect, FindOptionsWhere } from 'typeorm';

export type FindParams<T> = {
  where?: FindOptionsWhere<T> | FindOptionsWhere<T>[];
  select?: FindOptionsSelect<T>;
  relations?: string[];
  limit?: number;
  page?: number;
};