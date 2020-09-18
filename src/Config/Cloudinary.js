const cloudinary = require('cloudinary').v2

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD || 'cloudname',
  api_key: process.env.CLOUDINARY_KEY || 'key',
  api_secret: process.env.CLOUDINARY_SECRET || 'secret'
})

module.exports = cloudinary