const multer = require('multer');
const path = require('path');
const filePath  = 'public/images';
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null , filePath)
    },
    filename:function (req, file, cb) {
        const uniqueSuffix  = Date.now() + '-' + Math.round(Math.random() *1e9);
        const originalExtension = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + originalExtension);
    }
});

const upload = multer({storage});

module.exports  = upload;