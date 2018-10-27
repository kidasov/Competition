import { Context } from 'koa';
import { SessionInstance } from './db/models/session';
import * as t from 'io-ts';
import { Option } from 'fp-ts/lib/Option';
import { UserId } from './db/models/user';

declare module 'koa' {
  interface BaseContext {
    session(): Promise<Option<SessionInstance>>;
    requireSession(): Promise<SessionInstance>;
    sessionUserId(): Promise<UserId | null>;
    decode<T>(type: t.Type<T>): T;
    paramString(name: string): string;
    paramNumber(name: string): number;
  }
}
