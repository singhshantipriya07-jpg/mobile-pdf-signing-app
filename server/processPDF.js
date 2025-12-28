import fs from "fs";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

export async function processPDF(filePath, signatureDataUrl) {
  // Simulate processing delay (mock signing)
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Read the PDF file
  const pdfBytes = fs.readFileSync(filePath);
  const pdfDoc = await PDFDocument.load(pdfBytes);
  
  // Embed standard font for text rendering
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBoldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  
  // Get the first page to add signature
  const pages = pdfDoc.getPages();
  const firstPage = pages[0];
  const { width, height } = firstPage.getSize();
  
  // If signature image is provided, add it to the PDF
  if (signatureDataUrl) {
    // Extract base64 data
    const base64Data = signatureDataUrl.replace(/^data:image\/\w+;base64,/, '');
    const signatureImageBytes = Buffer.from(base64Data, 'base64');
    
    // Embed the signature image
    let signatureImage;
    try {
      signatureImage = await pdfDoc.embedPng(signatureImageBytes);
    } catch (pngError) {
      // Try JPEG if PNG fails
      try {
        signatureImage = await pdfDoc.embedJpg(signatureImageBytes);
      } catch (jpgError) {
        console.error("Error embedding signature image:", jpgError);
        // Continue without signature image if embedding fails
      }
    }
    
    if (signatureImage) {
      // Add signature image to bottom right corner
      const signatureWidth = 150;
      const signatureHeight = 60;
      const margin = 20;
      
      firstPage.drawImage(signatureImage, {
        x: width - signatureWidth - margin,
        y: margin,
        width: signatureWidth,
        height: signatureHeight,
      });
    }
  }
  
  // Always add a signature stamp/text to simulate signing
  const margin = 30;
  const stampWidth = 220;
  const stampHeight = 90;
  const stampX = width - stampWidth - margin;
  const stampY = margin; // Bottom of page (PDF coordinates start from bottom-left)
  
  console.log(`Adding signature stamp at position: x=${stampX}, y=${stampY}, page size: ${width}x${height}`);
  
  // Draw signature box background with semi-transparent fill
  firstPage.drawRectangle({
    x: stampX,
    y: stampY,
    width: stampWidth,
    height: stampHeight,
    borderColor: rgb(0.2, 0.4, 0.8),
    borderWidth: 3,
    color: rgb(0.95, 0.95, 1),
  });
  
  // Add "SIGNED" text with bold font
  firstPage.drawText("SIGNED", {
    x: stampX + 15,
    y: stampY + 55,
    size: 28,
    font: helveticaBoldFont,
    color: rgb(0.2, 0.4, 0.8),
  });
  
  // Add date
  const date = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
  firstPage.drawText(date, {
    x: stampX + 15,
    y: stampY + 30,
    size: 13,
    font: helveticaFont,
    color: rgb(0.3, 0.3, 0.3),
  });
  
  // Add "Mock Server" text
  firstPage.drawText("Mock Server", {
    x: stampX + 15,
    y: stampY + 12,
    size: 11,
    font: helveticaFont,
    color: rgb(0.5, 0.5, 0.5),
  });
  
  console.log("Signature stamp added successfully");
  
  // Save the modified PDF
  return await pdfDoc.save();
}

