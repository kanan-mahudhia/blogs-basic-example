const { ObjectID } = require('mongodb');
const BlogCommentRepository = require('./blogCommentRepository');

class BlogCommentService {
  constructor() {
    this.repository = new BlogCommentRepository();
  }

  //get count
  getCount() {
    return this.repository.getCount();
  }
  
  //get all blog comments
  getAllBlogComments() {
    return this.repository.getAllBlogComments();
  }

  //get blog comments by blog_id
  getBlogCommentsByBlog(blog_id) {
    return this.repository.getBlogCommentsByBlog(blog_id);
  }

  //save blog comment
  saveBlogComment(blog_comment, user_id) {
    const newBlogComment = {
      user_id: new ObjectID(user_id),
      blog_id: new ObjectID(blog_comment.blog_id),
      title: blog_comment.title,
      comment_text: blog_comment.comment_text,
      created_timestamp: new Date(),
      updated_timestamp: null
    };
    return this.repository.add(newBlogComment);
  }

  addMany(categories) {
    return this.repository.addMany(categories);
  }

}

module.exports = BlogCommentService;
