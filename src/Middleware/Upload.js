const Multer = require('multer')

const Store = Multer.diskStorage({
  destination: 'public/img',
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + '-' + file.originalname)
  }
})

const Filter = (req, file, cb) => {
  if (file.mimetype == 'image/jpg' || file.mimetype == 'image/png' || file.mimetype == 'image/jpeg'){
    cb(null, true)
  } else {
    cb(null, false)
  }
}

const Upload = Multer({
  storage: Store,
  fileFilter: Filter
})

module.exports = Upload
