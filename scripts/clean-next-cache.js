#!/usr/bin/env node
// scripts/clean-next-cache.js
//
// Deletes .next/ before every build. Next's typed-routes feature caches
// generated files there (e.g. .next/dev/types/validator.ts) that reference
// every route present at the time of the last build. Since .next/ is
// gitignored, switching branches with a different route structure (e.g.
// one branch has /admin, another doesn't) leaves that cache stale and
// pointing at routes that no longer exist in the current source tree --
// producing a confusing type error that has nothing to do with the actual
// code. Wiping it fresh before every build avoids that entirely.
//
// Cross-platform: uses Node's fs module directly instead of `rm -rf` /
// `Remove-Item`, so it runs identically on Windows, macOS, and Linux.

const fs = require('fs');
const path = require('path');

const nextDir = path.join(__dirname, '..', '.next');

if (fs.existsSync(nextDir)) {
  console.log('Clearing stale .next build cache...');
  fs.rmSync(nextDir, { recursive: true, force: true });
} else {
  console.log('No .next cache to clear.');
}