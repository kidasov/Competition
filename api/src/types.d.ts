import { Context } from 'koa';
import { SessionInstance } from './db/models/session';
import * as t from 'io-ts';

declare module 'koa' {
  interface Context {
    session?: SessionInstance;
    requireSession(): SessionInstance;
    decode<T>(type: t.Type<T>): T;
    param(name: string): string;
  }
}
