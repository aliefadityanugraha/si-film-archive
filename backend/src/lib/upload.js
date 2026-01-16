import fs from 'fs';
import path from 'path';
import { pipeline } from 'stream/promises';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UPLOAD_DIR = path.join(__dirname, '../../uploads');

// Ensure upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

export async function saveFile(file) {
  const extension = path.extname(file.filename);
  const uniqueName = `${crypto.randomUUID()}${extension}`;
  const filePath = path.join(UPLOAD_DIR, uniqueName);
  
  await pipeline(file.file, fs.createWriteStream(filePath));
  
  return `/uploads/${uniqueName}`;
}

export async function deleteFile(fileUrl) {
  if (!fileUrl) return;

  try {
    // Extract filename from URL/path
    // Handle both full URLs and relative paths
    const filename = fileUrl.split('/').pop();
    if (!filename) return;

    const filePath = path.join(UPLOAD_DIR, filename);
    
    if (fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath);
      console.log(`Deleted file: ${filePath}`);
    }
  } catch (err) {
    console.error(`Failed to delete file ${fileUrl}:`, err);
  }
}
