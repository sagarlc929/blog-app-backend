import multer from "multer";

// Configure multer to use memory storage
const storage = multer.memoryStorage();

// Set up multer with the memory storage
const upload = multer({ storage });

export default upload;
