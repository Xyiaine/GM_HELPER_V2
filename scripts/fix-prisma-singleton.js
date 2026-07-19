// Fix PrismaClient singleton in GM route files
// This script removes `const { PrismaClient } = require('@prisma/client');` and
// `const prisma = new PrismaClient();` lines, and adds `const prisma = req.app.get('prisma');`
// as the first line inside each route handler's try block.

const fs = require('fs');
const path = require('path');

const gmDir = path.join(__dirname, '..', 'server', 'src', 'routes', 'gm');
const files = fs.readdirSync(gmDir).filter(f => f.endsWith('.js'));

for (const file of files) {
  const filePath = path.join(gmDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');
  const originalContent = content;

  // Remove PrismaClient import line
  content = content.replace(/const \{ PrismaClient \} = require\('@prisma\/client'\);\n/g, '');
  
  // Remove prisma instantiation line
  content = content.replace(/const prisma = new PrismaClient\(\);\n/g, '');

  // Add `const prisma = req.app.get('prisma');` at the start of each async route handler
  // Pattern: find `async (req, res) => {\n  try {\n` and add the prisma line
  content = content.replace(
    /async \(req, res\) => \{\n(\s*)try \{/g,
    (match, indent) => `async (req, res) => {\n${indent}const prisma = req.app.get('prisma');\n${indent}try {`
  );

  // Also handle `async (tx) =>` patterns inside $transaction - don't add prisma there
  // (they already have the prisma variable from the outer scope)

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`Fixed: ${file}`);
  } else {
    console.log(`No changes: ${file}`);
  }
}

console.log('\nDone! All GM route files updated.');
