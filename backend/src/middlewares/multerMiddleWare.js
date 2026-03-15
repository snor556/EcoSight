//this is multer middle ware to upload the image
const multer = require("multer")

//configures the storage path 
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    //cb => callback
    cb(null, 'uploads/')},
    filename : function(req,file,cb){
        const ext = path.extName;
    }
  }
})

const upload = multer({ storage: storage })

module.exports = upload;
