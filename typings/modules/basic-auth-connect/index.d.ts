// Generated by typings
// Source: https://raw.githubusercontent.com/typed-typings/npm-basic-auth-connect/42bcc7273c013e68d9b01985001ca417da031457/index.d.ts
declare module '~basic-auth-connect/index' {
function basicAuthConnect (callback: (username: string, password: string) => boolean, realm?: string): basicAuthConnect.Middleware;
function basicAuthConnect (callback: (username: string, password: string, cb: (err: Error, user: any) => any) => any, realm?: string): basicAuthConnect.Middleware;
function basicAuthConnect (username: string, password: string, realm?: string): basicAuthConnect.Middleware;

namespace basicAuthConnect {
  export type Middleware = (req: any, res: any, next: (err: Error) => any) => void;
}

export = basicAuthConnect;
}
declare module 'basic-auth-connect/index' {
import alias = require('~basic-auth-connect/index');
export = alias;
}
declare module 'basic-auth-connect' {
import alias = require('~basic-auth-connect/index');
export = alias;
}