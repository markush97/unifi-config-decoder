#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

const version = process.argv[2];

function fail(msg) {
  console.error(`ERROR: ${msg}`);
  process.exit(1);
}

if (!version) fail('No version provided. Usage: node git/update-versions.js 1.2.3');

// Basic semver check, allow pre-release/build metadata
const SEMVER_RE = /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/;
if (!SEMVER_RE.test(version)) fail(`Invalid semver: '${version}'`);

const repoRoot = process.cwd();
const targets = [
  {
    type: 'ts',
    file: path.join(repoRoot, 'src', 'version.ts'),
    render: v => `export const APP_VERSION = '${v}';\n`,
  },
  {
    type: 'pkg',
    file: path.join(repoRoot, 'package.json'),
  },
];

const changed = [];
const skipped = [];

function safeWrite(file, content) {
  const dir = path.dirname(file);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(file, content, 'utf8');
}

for (const t of targets) {
  if (!fs.existsSync(t.file)) {
    skipped.push({ file: t.file, reason: 'missing' });
    continue;
  }

  try {
    if (t.type === 'ts') {
      const next = t.render(version);
      const cur = fs.readFileSync(t.file, 'utf8');
      if (cur !== next) {
        safeWrite(t.file, next);
        changed.push(t.file);
      } else {
        skipped.push({ file: t.file, reason: 'up-to-date' });
      }
    } else if (t.type === 'pkg') {
      const raw = fs.readFileSync(t.file, 'utf8');
      const pkg = JSON.parse(raw);
      if (pkg.version !== version) {
        pkg.version = version;
        const pretty = JSON.stringify(pkg, null, 2) + '\n';
        safeWrite(t.file, pretty);
        changed.push(t.file);
      } else {
        skipped.push({ file: t.file, reason: 'up-to-date' });
      }
    }
  } catch (e) {
    fail(`Failed processing ${t.file}: ${e.message}`);
  }
}

console.log(`Version set to ${version}`);
if (changed.length) {
  console.log('Updated:');
  changed.forEach(f => console.log(`  - ${path.relative(repoRoot, f)}`));
}
if (skipped.length) {
  console.log('Skipped:');
  skipped.forEach(s => console.log(`  - ${path.relative(repoRoot, s.file)} (${s.reason})`));
}
