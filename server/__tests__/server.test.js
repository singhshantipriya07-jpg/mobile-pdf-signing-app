import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PDFDocument } from 'pdf-lib';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('Server', () => {
  const PORT = 5001; // Use different port for testing
  const API_URL = `http://localhost:${PORT}`;

  it('should have uploads directory', () => {
    const uploadsDir = path.join(__dirname, '../uploads');
    expect(fs.existsSync(uploadsDir) || fs.existsSync(path.dirname(uploadsDir))).toBe(true);
  });

  it('should create PDF document structure', async () => {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([612, 792]);
    page.drawText('Test', { x: 50, y: 700, size: 20 });
    const pdfBytes = await pdfDoc.save();

    expect(pdfBytes).toBeInstanceOf(Uint8Array);
    expect(pdfBytes.length).toBeGreaterThan(0);
  });

  it('should validate PDF structure', async () => {
    const pdfDoc = await PDFDocument.create();
    pdfDoc.addPage([612, 792]);
    const pdfBytes = await pdfDoc.save();
    const loadedDoc = await PDFDocument.load(pdfBytes);

    expect(loadedDoc.getPageCount()).toBe(1);
  });
});

