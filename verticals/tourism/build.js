// Vercel build script – handles frontend build + prisma (non-fatal)
import { execSync } from 'child_process';

console.log('[build] Starting frontend build...');
try {
  execSync('cd app && npm install && npm run build', { stdio: 'inherit', shell: true });
} catch (e) {
  console.error('[build] Frontend build failed!');
  process.exit(1);
}

console.log('[build] Frontend build complete!');

// Prisma db push – fail gracefully if no DATABASE_URL
try {
  execSync('npx prisma db push --accept-data-loss', { stdio: 'inherit', shell: true });
} catch (e) {
  console.log('[build] Prisma db push skipped (no DATABASE_URL or other error)');
}

console.log('[build] All done!');
process.exit(0);
