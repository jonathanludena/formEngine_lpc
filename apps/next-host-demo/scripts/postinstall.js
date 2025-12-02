#!/usr/bin/env node

/**
 * Conditional postinstall script
 * Only runs prisma generate in appropriate contexts:
 * - During local development
 * - During Vercel builds
 * - When DATABASE_URL is available
 * 
 * Skips when:
 * - Publishing packages (CI=true without DATABASE_URL)
 * - Installing dependencies in other workspace packages
 */

const { execSync } = require('child_process');
const path = require('path');

// Check if we're in the right context to run prisma generate
const isCI = process.env.CI === 'true';
const isVercel = process.env.VERCEL === '1';
const hasDatabaseUrl = !!process.env.DATABASE_URL;
const isNextHostDemo = process.cwd().includes('next-host-demo');

// Only run if:
// 1. We're in the next-host-demo directory
// 2. And either: we have DATABASE_URL, or we're on Vercel
const shouldRunPrisma = isNextHostDemo && (hasDatabaseUrl || isVercel || !isCI);

if (shouldRunPrisma) {
  console.log('🔄 Running prisma generate...');
  try {
    execSync('prisma generate', { stdio: 'inherit' });
    console.log('✅ Prisma client generated successfully');
  } catch (error) {
    console.error('❌ Failed to generate Prisma client:', error.message);
    // Don't fail the installation if prisma generate fails in some contexts
    if (isVercel) {
      process.exit(1);
    }
  }
} else {
  console.log('⏭️  Skipping prisma generate (not in deployment context)');
}
