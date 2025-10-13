#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');

function findFiles(dir, exts = ['.js', '.jsx', '.ts', '.tsx']) {
  const result = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name === 'node_modules' || e.name === '.git') continue;
      result.push(...findFiles(full, exts));
    } else {
      if (exts.includes(path.extname(e.name))) result.push(full);
    }
  }
  return result;
}

function parseImports(fileContent) {
  const importRegex = /import\s+(?:[^'";]+from\s+)?['"](.+)['"]/g;
  const imports = [];
  let m;
  while ((m = importRegex.exec(fileContent))) {
    imports.push(m[1]);
  }
  return imports;
}

function resolveImport(filePath, spec) {
  if (!spec.startsWith('.') && !spec.startsWith('/')) return true;

  const basedir = path.dirname(filePath);
  const candidate = path.resolve(basedir, spec);

  const tryExt = ['', '.js', '.jsx', '.ts', '.tsx', '/index.js', '/index.jsx', '/index.ts', '/index.tsx'];
  for (const ext of tryExt) {
    const p = candidate + ext;
    if (fs.existsSync(p) && fs.statSync(p).isFile()) return true;
  }
  return false;
}

function main() {
  console.log('Scanning project files for broken imports...');
  const files = findFiles(root);
  const problems = [];
  for (const f of files) {
    const content = fs.readFileSync(f, 'utf8');
    const imports = parseImports(content);
    for (const imp of imports) {
      if (!resolveImport(f, imp)) {
        problems.push({ file: path.relative(root, f), import: imp });
      }
    }
  }

  if (problems.length === 0) {
    console.log('No broken relative imports found.');
    process.exit(0);
  }

  console.error('\nFound broken imports:');
  for (const p of problems) {
    console.error(` - ${p.file} -> ${p.import}`);
  }
  process.exit(2);
}

if (require.main === module) main();
