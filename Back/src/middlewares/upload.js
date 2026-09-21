const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({

  destination: (req, file, cb) => {

    const uploadPath = path.resolve(
      __dirname,
      "../../uploads"
    );

    console.log("📁 GUARDANDO ARCHIVO EN:");
    console.log(uploadPath);

    cb(null, uploadPath);
  },

  filename: (req, file, cb) => {

    const extension =
      path.extname(file.originalname);

    const nombre =
      path.basename(
        file.originalname,
        extension
      )
      .replace(/[^a-zA-Z0-9-_]/g, "_");

    const nombreFinal =
      `${Date.now()}-${nombre}${extension}`;

    console.log(
      "📄 ARCHIVO:",
      nombreFinal
    );

    cb(null, nombreFinal);
  }

});

module.exports = multer({
  storage
});