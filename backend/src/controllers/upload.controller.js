import util from 'util';
import { pipeline } from 'stream';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const pump = util.promisify(pipeline);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UPLOAD_DIR = path.join(__dirname, '../../uploads');

// Ensure upload dir exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

export class UploadController {
  async uploadFile(request, reply) {
    const data = await request.file();
    
    if (!data) {
      return reply.status(400).send({
        success: false,
        message: 'No file uploaded'
      });
    }

    // Sanitize filename and add timestamp
    const timestamp = Date.now();
    const ext = path.extname(data.filename);
    const basename = path.basename(data.filename, ext).replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = `${basename}-${timestamp}${ext}`;
    const filepath = path.join(UPLOAD_DIR, filename);

    try {
      // Save file
      await pump(data.file, fs.createWriteStream(filepath));

      // Construct URL (relative path from root, handled by static middleware)
      const fileUrl = `${process.env.API_URL || 'http://localhost:3000'}/uploads/${filename}`;

      return reply.send({
        success: true,
        data: {
          url: fileUrl,
          filename: filename,
          mimetype: data.mimetype
        }
      });
    } catch (err) {
      console.error('Upload error:', err);
      return reply.status(500).send({
        success: false,
        message: 'Failed to upload file'
      });
    }
  }
}

export const uploadController = new UploadController();
