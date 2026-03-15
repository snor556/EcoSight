//this is multer middle ware to upload the image
const multer = require("multer")
const path = require("path");

//configures the storage path 
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    //cb => callback
    cb(null, 'uploads/')},
    //filename helps save the file directly in that format instead of binary
    
    filename : function(req,file,cb){
        const ext = path.extname(file.originalname);
        cb(null,Date.now() + ext);
    }
  }
)

const upload = multer({ storage: storage })

module.exports = upload;
