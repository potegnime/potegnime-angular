#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const arg = process.argv[2];
if (arg !== 'true' && arg !== 'false') {
  console.error('Usage: node scripts/set-environment.js <true|false>');
  process.exit(2);
}

const productionValue = arg === 'true';
const envPath = path.join(__dirname, '..', 'src', 'environment.ts');
let content = fs.readFileSync(envPath, 'utf8');

const productionRegex = /(production\s*:\s*)(true|false)/;
if (!productionRegex.test(content)) {
  console.error('Failed to find production flag in', envPath);
  process.exit(3);
}

const updated = content.replace(productionRegex, `$1${productionValue}`);

if (updated === content) {
  // No change necessary — production already set to requested value.
  process.exit(0);
}

fs.writeFileSync(envPath, updated, 'utf8');
console.log(`Wrote production: ${productionValue} to ${envPath}`);
