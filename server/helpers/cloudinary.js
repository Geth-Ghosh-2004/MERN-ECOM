const cloudinary = require("cloudinary");
const multer = require("multer");

cloudinary.config({
  cloud_name: "dlh9lzbnp",
  api_key: "144125725842749",
  api_secret: "1rFetsmd59D_7nodD2Xnk65Nuos",
});

const storage = new multer.memoryStorage();

async function imageUploadUtil(file) {
  const result = await cloudinary.uploader.upload(file, {
    resource_type: "auto",
  });

  return result;
}

const upload = multer({ storage });

module.exports = { upload, imageUploadUtil };
