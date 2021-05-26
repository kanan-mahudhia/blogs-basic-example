const BlogCategoryRepository = require('./blogCategoryRepository');

class BlogCategoryService {
  constructor() {
    this.repository = new BlogCategoryRepository();
  }

  //get count
  getCount() {
    return this.repository.getCount();
  }
  
  //get all blog categories
  getAllBlogCategories() {
    return this.repository.getAllBlogCategories();
  }

  //save blog category
  saveBlogCategory(blog_category) {
    const newBlogCategory = {
      name: blog_category.name,
      created_timestamp: new Date(),
      updated_timestamp: null
    };
    return this.repository.add(newBlogCategory);
  }

  addMany(categories) {
    return this.repository.addMany(categories);
  }
}

module.exports = BlogCategoryService;
