import { FindOptions } from 'sequelize';

export const applyPaginationOptions = (options: FindOptions, limit: number, page: number) => {
  if (limit && page) {
    const offset = (page - 1) * limit;
    options.limit = limit;
    options.offset = offset;
  } else if (limit) {
    options.limit = limit;
  }
};

export const calculateAmountOfPages = (count: number, limit: number) => Math.ceil(count / limit);
