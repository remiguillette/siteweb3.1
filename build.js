#!/usr/bin/env node

import { spawn } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';

console.log('🚀 Starting optimized build process...');

// Step 1: Clean previous build
console.log('🧹 Cleaning previous build...');
try {
  await fs.rm('dist', { recursive: true, force: true });
  console.log('✅ Previous build cleaned');
} catch (error) {
  console.log('ℹ️  No previous build to clean');
}

// Step 2: Build frontend
console.log('🔨 Building frontend...');
const viteBuild = spawn('npx', ['vite', 'build'], { 
  stdio: 'inherit',
  shell: true
});

await new Promise((resolve, reject) => {
  viteBuild.on('close', (code) => {
    if (code === 0) {
      console.log('✅ Frontend build complete');
      resolve();
    } else {
      reject(new Error(`Frontend build failed with code ${code}`));
    }
  });
});

// Step 3: Build backend
console.log('🔨 Building backend...');
const backendBuild = spawn('npx', ['esbuild', 'server/index.ts', '--platform=node', '--packages=external', '--bundle', '--format=esm', '--outdir=dist'], {
  stdio: 'inherit',
  shell: true
});

await new Promise((resolve, reject) => {
  backendBuild.on('close', (code) => {
    if (code === 0) {
      console.log('✅ Backend build complete');
      resolve();
    } else {
      reject(new Error(`Backend build failed with code ${code}`));
    }
  });
});

// Step 4: Verify build output
console.log('🔍 Verifying build output...');
try {
  const distStats = await fs.stat('dist');
  const publicStats = await fs.stat('dist/public');
  const indexStats = await fs.stat('dist/index.js');
  
  console.log('✅ Build verification complete:');
  console.log('  - dist/ directory exists');
  console.log('  - dist/public/ directory exists (frontend)');
  console.log('  - dist/index.js exists (backend)');
  console.log('🎉 Build process completed successfully!');
} catch (error) {
  console.error('❌ Build verification failed:', error.message);
  process.exit(1);
}