const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');

const BlogService = require('./blogService');
const blogService = new BlogService();

//get all blogs
router.get('/get_blogs', (req, res) => {
  blogService
    .getAllBlogs()
    .then(blogs => res.send(
      {
        status: 200,
        data: blogs
      }
    ))
    .catch(err => res.status(400).send(
      {
        status: 400,
        err: err.message
      }
    ));
});

// save blog
router.post('/save_blog', [
  body('blog_cat_id', 'Please select valid blog category').isMongoId(),
  body('title', 'Please enter valid blog title. Min. length 2').isString().trim().isLength({ min: 2 }),
  body('blog_text', 'Please enter valid blog text. Min. length 2').isString().trim().isLength({ min: 2 })
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    var err_array = errors.array();
    res.status(422).send(
      {
        status: 422,
        err_msg: err_array[0].msg
      });
  } else {
    blogService
      .saveBlog(req.body, req.user.id)
      .then((result) => res.status(200).send(
        {
          status: 200,
          data: result
        }
      ))
      .catch(err => res.status(400).send(
        {
          status: 400,
          err_msg: err.message
        }
      ));


  }
});

module.exports = router;
