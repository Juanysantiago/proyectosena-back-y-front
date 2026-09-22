const multer = require("multer");
const path = require("path");
const fs = require("fs");

// ======================================================
// RUTA CORRECTA
//
// upload.js está en:
// Back/src/middlewares/upload.js
//
// uploads está en:
// Back/uploads
//
// ../../uploads = Back/uploads
// ======================================================

const uploadPath = path.resolve(
  __dirname,
  "../../uploads"
);

console.log("=================================");
console.log("📁 CARPETA UPLOADS:");
console.log(uploadPath);
console.log("=================================");

// ======================================================
// CREAR CARPETA SI NO EXISTE
// ======================================================

if (!fs.existsSync(uploadPath)) {

  fs.mkdirSync(
    uploadPath,
    {
      recursive: true,
    }
  );

  console.log(
    "✅ Carpeta uploads creada"
  );
}

// ======================================================
// STORAGE
// ======================================================

const storage =
  multer.diskStorage({

    destination: (
      req,
      file,
      cb
    ) => {

      console.log(
        "📁 GUARDANDO ARCHIVO EN:"
      );

      console.log(
        uploadPath
      );

      cb(
        null,
        uploadPath
      );
    },

    filename: (
      req,
      file,
      cb
    ) => {

      const extension =
        path.extname(
          file.originalname
        );

      const nombre =
        path.basename(
          file.originalname,
          extension
        ).replace(
          /[^a-zA-Z0-9-_]/g,
          "_"
        );

      const nombreFinal =
        `${Date.now()}-${nombre}${extension}`;

      console.log(
        "📄 ARCHIVO:",
        nombreFinal
      );

      cb(
        null,
        nombreFinal
      );
    },

  });

// ======================================================
// MULTER
// ======================================================

module.exports =
  multer({
    storage,
  });