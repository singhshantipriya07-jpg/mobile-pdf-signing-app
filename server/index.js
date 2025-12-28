import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import busboy from "busboy";
import { processPDF } from "./processPDF.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadsDir = path.join(__dirname, "uploads");

// Ensure uploads directory exists
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const server = http.createServer((req, res) => {
  // Handle CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(200);
    res.end();
    return;
  }

  if (req.method === "POST" && req.url === "/sign") {
    const bb = busboy({ headers: req.headers });
    let filePath = null;
    let signatureDataUrl = null;

    bb.on("file", (name, file, info) => {
      if (name === "pdf") {
        const { filename, encoding, mimeType } = info;
        filePath = path.join(uploadsDir, `${Date.now()}-${filename}`);
        const writeStream = fs.createWriteStream(filePath);
        file.pipe(writeStream);
      } else {
        file.resume();
      }
    });

    bb.on("field", (name, value) => {
      if (name === "signature") {
        signatureDataUrl = value;
      }
    });

    bb.on("finish", async () => {
      if (!filePath) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "No PDF file uploaded" }));
        return;
      }

      try {
        const modifiedPdfBytes = await processPDF(filePath, signatureDataUrl);
        
        // Send the PDF
        res.writeHead(200, {
          "Content-Type": "application/pdf",
          "Content-Disposition": 'inline; filename="signed.pdf"',
        });
        res.end(modifiedPdfBytes);
        
        // Clean up uploaded file
        try {
          fs.unlinkSync(filePath);
        } catch (err) {
          console.error("Error deleting file:", err);
        }
      } catch (error) {
        console.error("Error processing PDF:", error);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Error processing PDF: " + error.message }));
        
        // Clean up uploaded file
        if (filePath) {
          try {
            fs.unlinkSync(filePath);
          } catch (unlinkErr) {
            console.error("Error deleting file:", unlinkErr);
          }
        }
      }
    });

    bb.on("error", (err) => {
      console.error("Busboy error:", err);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Error parsing request: " + err.message }));
    });

    req.pipe(bb);
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Not found" }));
  }
});

server.listen(5000, () => {
  console.log("Server running on port 5000");
});
