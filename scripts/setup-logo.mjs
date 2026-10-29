import { copyFile, mkdir, access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
const destination = fileURLToPath(new URL('../public/logo.jpg', import.meta.url));
const source = process.argv[2] || 'C:/Users/sm137/Downloads/JKbeatiq.jpg';
try { await access(source); await mkdir(new URL('../public/', import.meta.url), { recursive: true }); await copyFile(source, destination); console.log('Your supplied logo is installed.'); }
catch { console.log('Logo source unavailable. Run: node scripts/setup-logo.mjs "path/to/JKbeatiq.jpg"'); }
