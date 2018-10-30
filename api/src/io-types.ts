import * as t from 'io-ts';

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
