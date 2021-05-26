const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');

const BlogCommentService = require('./blogCommentService');
const blogCommentService = new BlogCommentService();

//get all blog comments
router.get('/get_blog_comments', (req, res) => {
  blogCommentService
    .getAllBlogComments()
    .then(blog_comments => res.send(
      {
        status: 200,
        data: blog_comments
      }
    ))
    .catch(err => res.status(400).send(
      {
        status: 400,
        err: err.message
      }
    ));
});

// save blog comment
router.post('/save_blog_comment', [
  body('blog_id', 'Please select valid blog').isMongoId(),
  body('title', 'Please enter valid blog comment title. Min. length 2').isString().trim().isLength({ min: 2 }),
  body('comment_text', 'Please enter valid blog comment text. Min. length 2').isString().trim().isLength({ min: 2 })
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
    blogCommentService
      .saveBlogComment(req.body, req.user.id)
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

router.post('/get_comments_by_blog', [
  body('blog_id', 'Please select valid blog').isMongoId()
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
    blogCommentService
    .getBlogCommentsByBlog(req.body.blog_id)
    .then(blog_comments => res.send(
      {
        status: 200,
        data: blog_comments
      }
    ))
    .catch(err => res.status(400).send(
      {
        status: 400,
        err: err.message
      }
    ));
  }
});

module.exports = router;
