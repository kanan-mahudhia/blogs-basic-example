const { ObjectID } = require('mongodb');
const BlogRepository = require('./blogRepository');

class BlogService {
  constructor() {
    this.repository = new BlogRepository();
  }

  //get count
  getCount() {
    return this.repository.getCount();
  }

  //get all blogs
  getAllBlogs() {
    return this.repository.getAllBlogs();
  }

  //save blog
  saveBlog(blog, user_id) {
    const newBlog = {
      user_id: new ObjectID(user_id),
      blog_cat_id: new ObjectID(blog.blog_cat_id),
      title: blog.title,
      blog_text: blog.blog_text,
      created_timestamp: new Date(),
      updated_timestamp: null
    };
    return this.repository.add(newBlog);
  }

  addMany(users) {
    return this.repository.addMany(users);
  }
}

module.exports = BlogService;
