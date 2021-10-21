const express = require('express');
const {
  addPost,
  getPosts,

} = require('../controllers/postController');
const authMiddleware = require('../middleware/authMiddleware');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const router = express.Router();
const cloudinary = require('../helpers/cloudinary');

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'images'
  },
});


const upload = multer({ storage });


router.post('/addpost', upload.single('photo'), authMiddleware, addPost);
router.get('/', getPosts);


module.exports = router;
