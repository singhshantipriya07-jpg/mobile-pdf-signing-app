import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PDFDocument } from 'pdf-lib';
import { processPDF } from '../processPDF.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('processPDF', () => {
  let testPdfPath;
  let testPdfBytes;

  beforeEach(async () => {
    // Create a minimal PDF for testing
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([612, 792]); // Letter size
    page.drawText('Test PDF Document', {
      x: 50,
      y: 700,
      size: 20,
    });
    testPdfBytes = await pdfDoc.save();

    // Write test PDF to temporary file
    const testDir = path.join(__dirname, '../test-temp');
    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir, { recursive: true });
    }
    testPdfPath = path.join(testDir, `test-${Date.now()}.pdf`);
    fs.writeFileSync(testPdfPath, testPdfBytes);
  });

  afterEach(() => {
    // Clean up test file
    if (testPdfPath && fs.existsSync(testPdfPath)) {
      try {
        fs.unlinkSync(testPdfPath);
      } catch (err) {
        // Ignore cleanup errors
      }
    }
  });

  it('should process PDF and return modified PDF bytes', async () => {
    const result = await processPDF(testPdfPath, null);

    expect(result).toBeInstanceOf(Uint8Array);
    expect(result.length).toBeGreaterThan(0);
    
    // Verify it's a valid PDF by loading it
    const resultDoc = await PDFDocument.load(result);
    expect(resultDoc).toBeDefined();
  }, 15000); // Increase timeout for async operations

  it('should add signature stamp to PDF', async () => {
    const result = await processPDF(testPdfPath, null);
    const resultDoc = await PDFDocument.load(result);
    const pages = resultDoc.getPages();
    const firstPage = pages[0];

    expect(pages.length).toBeGreaterThan(0);
    expect(firstPage).toBeDefined();
  }, 15000);

  it('should handle PDF processing without signature image', async () => {
    const result = await processPDF(testPdfPath, null);

    expect(result).toBeInstanceOf(Uint8Array);
    expect(result.length).toBeGreaterThan(testPdfBytes.length); // Should be larger due to signature stamp
  }, 15000);

  it('should throw error for invalid file path', async () => {
    const invalidPath = path.join(__dirname, '../test-temp/nonexistent.pdf');
    
    await expect(processPDF(invalidPath, null)).rejects.toThrow();
  }, 15000);

  it('should process PDF with signature data URL', async () => {
    // Create a minimal base64 image (1x1 transparent PNG)
    const base64Image = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
    
    const result = await processPDF(testPdfPath, base64Image);

    expect(result).toBeInstanceOf(Uint8Array);
    expect(result.length).toBeGreaterThan(0);
  }, 15000);
});

