#!/usr/bin/env node

'use strict';

console.log('[server] cwd:', process.cwd());
console.log('[server] DEBUG:', process.env.DEBUG);

if (process.env.EXIT) {
  process.exit(1);
}
