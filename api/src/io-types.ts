import * as t from 'io-ts';
import { asUserId, UserId } from './db/models/user';

export const IsoDate = new t.Type<Date, string>(
  'Date',
  (m): m is Date => m instanceof Date,
  (value, ctx) =>
    t.string.validate(value, ctx).chain(str => {
      const date = new Date(str);
      return isNaN(date.getTime())
        ? t.failure<Date>(value, ctx)
        : t.success(date);
    }),
  v => v.toISOString(),
);

export const IoUserId = new t.Type<UserId, number>(
  'UserId',
  (m): m is UserId => typeof m === 'number',
  (value, ctx) =>
    t.number.validate(value, ctx).chain(num => t.success(asUserId(num))),
  v => +v,
);
