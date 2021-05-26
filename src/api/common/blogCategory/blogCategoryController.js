const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');

const BlogCategoryService = require('./blogCategoryService');
const blogCategoryService = new BlogCategoryService();

//get all blog categories
router.get('/get_blog_categories', (req, res) => {
  blogCategoryService
    .getAllBlogCategories()
    .then(blog_cats => res.send(
      {
        status: 200,
        data: blog_cats
      }
    ))
    .catch(err => res.status(400).send(
      {
        status: 400,
        err: err.message
      }
    ));
});

// save blog category
router.post('/save_blog_category', [
  body('name', 'Please enter valid blog category name. Min. length 2').isString().trim().isLength({ min: 2 }),
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
    blogCategoryService
      .saveBlogCategory(req.body, req.user.id)
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
