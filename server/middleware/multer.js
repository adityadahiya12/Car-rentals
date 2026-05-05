import multer from "multer";

const upload = multer({
  storage: multer.memoryStorage() // ✅ THIS FIXES EVERYTHING
});

export default upload;