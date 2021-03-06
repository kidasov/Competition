import { SessionInstance } from '../../db/models/session';
import { Option } from 'fp-ts/lib/Option';
import { UserId } from '../../db/models/user';
import * as t from 'io-ts';

declare module 'koa' {
  interface BaseContext {
    session(): Promise<Option<SessionInstance>>;
    requireSession(): Promise<SessionInstance>;
    sessionUserId(): Promise<UserId | null>;
    decode<T>(type: t.Type<T, any>): T;
    paramString(name: string): string;
    paramNumber(name: string): number;
  }
}
