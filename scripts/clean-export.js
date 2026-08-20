#!/usr/bin/env node
// scripts/clean-export.js
//
// Removes Next.js's client-side prefetch payload files and directories
// (anything named starting with "__next.") from the static export in
// /out, plus any directories left empty as a result. This eliminates
// directory/file name collisions (e.g. about/ vs about.html) that
// otherwise confuse Apache's automatic trailing-slash redirect.
//
// Cross-platform: uses Node's fs module directly instead of shell
// commands, so it runs identically on Windows, macOS, and Linux.
// Runs automatically after every "npm run build" via the "postbuild"
// script in package.json.

const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '..', 'out');

if (!fs.existsSync(outDir)) {
  console.error(`No 'out' folder found at ${outDir} - run 'npm run build' first.`);
  process.exit(1);
}

function removeShadowEntries(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.name.startsWith('__next.')) {
      fs.rmSync(fullPath, { recursive: true, force: true });
    } else if (entry.isDirectory()) {
      removeShadowEntries(fullPath);
    }
  }
}

function removeEmptyDirs(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      const fullPath = path.join(dir, entry.name);
      removeEmptyDirs(fullPath);
      if (fs.readdirSync(fullPath).length === 0) {
        fs.rmdirSync(fullPath);
      }
    }
  }
}

console.log('Removing __next.* files and directories...');
removeShadowEntries(outDir);

console.log('Removing directories left empty...');
removeEmptyDirs(outDir);

console.log("Done. 'out' is ready to upload.");
