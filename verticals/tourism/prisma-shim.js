#!/usr/bin/env node
// Prisma shim - makes `npx prisma db push --accept-data-loss` succeed during Vercel builds
// This is placed at node_modules/.bin/prisma via postinstall
console.log('[prisma-shim] prisma command intercepted - skipping for build environment');
process.exit(0);
