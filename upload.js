
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import express from "express"

const app=new express()
app.use(express.static('public'))

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const uploadDir = path.join(__dirname, 'uploads');
const uploadDir='public';

const ensureDirExists = (dir) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
         const username=req.headers['x-username' || 'unknown-user'];
         const destPath = path.join(uploadDir, username); // Subfolder for images
        ensureDirExists(destPath); // Ensure it exists before saving files
        cb(null, destPath);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

// Initialize multer
const upload = multer({ storage });

export default upload;
