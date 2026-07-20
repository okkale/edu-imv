import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { logger } from "../lib/logger";

const router = Router();

const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname) || ".bin";
    const safeName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9]/g, "_");
    cb(null, `${safeName}-${uniqueSuffix}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB limit
});

router.post("/upload", upload.single("file"), (req, res) => {
  try {
    if (!req.file) {
      if (req.body && req.body.fileData && typeof req.body.fileData === "string") {
        const matches = req.body.fileData.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        if (matches && matches.length === 3) {
          const mimeType = matches[1];
          const buffer = Buffer.from(matches[2], "base64");
          const ext = mimeType.split("/")[1] || "bin";
          const filename = `upload-${Date.now()}.${ext}`;
          const filePath = path.join(uploadsDir, filename);
          fs.writeFileSync(filePath, buffer);
          res.status(201).json({ url: `/api/uploads/${filename}` });
          return;
        }
      }
      res.status(400).json({ error: "No file uploaded" });
      return;
    }

    const fileUrl = `/api/uploads/${req.file.filename}`;
    logger.info({ filename: req.file.filename, size: req.file.size }, "File uploaded successfully");

    res.status(201).json({ url: fileUrl });
  } catch (err: any) {
    logger.error({ err }, "Error in file upload");
    res.status(500).json({ error: "Failed to upload file" });
  }
});

router.get("/uploads/:filename", (req, res) => {
  const filename = path.basename(req.params.filename);
  const filePath = path.join(uploadsDir, filename);

  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).json({ error: "File not found" });
  }
});

export default router;
