import fs from 'fs';
import path from 'path';

const distDir = path.resolve('dist');
const rootDir = path.resolve('.');

try {
  // 1. Move dist/src/index.html to ./index.html
  const compiledHtmlSrc = path.join(distDir, 'src', 'index.html');
  const targetHtml = path.join(rootDir, 'index.html');
  
  if (fs.existsSync(compiledHtmlSrc)) {
    fs.copyFileSync(compiledHtmlSrc, targetHtml);
    console.log('✓ Moved compiled index.html to root.');
  } else {
    throw new Error('Compiled index.html not found in dist/src/');
  }

  // 2. Move assets to ./assets/
  const distAssetsDir = path.join(distDir, 'assets');
  const targetAssetsDir = path.join(rootDir, 'assets');
  
  if (fs.existsSync(distAssetsDir)) {
    if (!fs.existsSync(targetAssetsDir)) {
      fs.mkdirSync(targetAssetsDir, { recursive: true });
    }
    
    const assetFiles = fs.readdirSync(distAssetsDir);
    assetFiles.forEach(file => {
      const srcFile = path.join(distAssetsDir, file);
      const destFile = path.join(targetAssetsDir, file);
      fs.copyFileSync(srcFile, destFile);
    });
    console.log(`✓ Copied ${assetFiles.length} compiled assets to ./assets/`);
  }

  // 3. Clean up dist/
  fs.rmSync(distDir, { recursive: true, force: true });
  console.log('✓ Cleaned up temporary dist directory.');
  console.log('★ Post-build execution completed successfully.');

} catch (err) {
  console.error('✗ Post-build error:', err.message);
  process.exit(1);
}
