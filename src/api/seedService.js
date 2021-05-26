const UserService = require('./common/user/userService');
const { ObjectID } = require('mongodb');
const cipher = require('./common/auth/cipherHelper');
const logger = require('../utils/logger');

const BlogService = require('./common/blog/BlogService');
const BlogCategoryService = require('./common/blogCategory/blogCategoryService');
const BlogCommentService = require('./common/blogComment/blogCommentService');

userService = new UserService();
blogService = new BlogService();
blogCategoryService = new BlogCategoryService();
blogCommentService = new BlogCommentService();

var blogToAdd = [], categoryToAdd = [], usersToAdd = [], commentToAdd = [];

class SeedService {
  checkAndSeed() {
    logger.info('Seed Data')
    userService.getCount()
      .then(count => {
        // console.log(count);
        if (!count) {
          this.seedUsers().then();
        }
      });

    blogCategoryService.getCount()
      .then(count => {
        // console.log(count);
        if (!count) {
          this.seedBlogCategories().then();
        }
      });

    blogService.getCount()
      .then(count => {
        // console.log(count);
        if (!count) {
          this.seedBlogs().then();
        }
      });

    blogCommentService.getCount()
      .then(count => {
        // console.log(count);
        if (!count) {
          this.seedBlogComments().then();
        }
      });

  }

  // seed
  async seedUsers() {
    try {
      logger.info('Seed Data');
      await this.addRandomUsers(this.getNames());
      logger.info('Seed Users Done');
    } catch (err) {
      logger.error(err);
    }
  }

  async seedBlogCategories() {
    try {
      await this.addRandomBlogCategories(this.getBlogCategories());
      logger.info('Seed Blog Categories Done');
    } catch (err) {
      logger.error(err);
    }
  }

  async seedBlogs() {
    try {
      await this.addRandomBlogs(this.getBlogs());
      logger.info('Seed Blogs Done');
    } catch (err) {
      logger.error(err);
    }
  }

  async seedBlogComments() {
    try {
      await this.addRandomBlogComments(this.getComments());
      logger.info('Seed Blogs Done');
    } catch (err) {
      logger.error(err);
    }
  }

  // add
  addRandomUsers(names) {
    for (let i = 0; i < 2; i++) {
      const hash = cipher.saltHashPassword(`admin`);
      const first_name = names[i].split(' ')[0];
      const last_name = names[i].split(' ')[1];
      const newUser = {
        _id: ObjectID(),
        email: `${first_name}_${last_name}@user.com`,
        first_name,
        last_name,
        salt: hash.salt,
        passwordHash: hash.passwordHash,
        created_timestamp: new Date(),
        updated_timestamp: null
      };
      usersToAdd.push(newUser);
    }
    return userService.addMany(usersToAdd);
  }

  addRandomBlogCategories(categories) {
    for (let i = 0; i < 2; i++) {
      const newCategory = {
        _id: ObjectID(),
        name: categories[i],
        created_timestamp: new Date(),
        updated_timestamp: null
      };
      categoryToAdd.push(newCategory);
    }
    return blogCategoryService.addMany(categoryToAdd);
  }

  addRandomBlogs(blogs) {
    for (let i = 0; i < 2; i++) {
      const newBlog = {
        _id: ObjectID(),
        user_id: new ObjectID(usersToAdd[i]._id),
        blog_cat_id: new ObjectID(categoryToAdd[i]._id),
        title: blogs[i].title,
        blog_text: blogs[i].blog_text,
        created_timestamp: new Date(),
        updated_timestamp: null
      };
      blogToAdd.push(newBlog);
    }
    return blogService.addMany(blogToAdd);
  }

  addRandomBlogComments(comments) {
    for (let i = 0; i < 2; i++) {
      const newComment = {
        _id: ObjectID(),
        user_id: new ObjectID(usersToAdd[i]._id),
        blog_id: new ObjectID(blogToAdd[i]._id),
        title: comments[i].title,
        comment_text: comments[i].comment_text,
        created_timestamp: new Date(),
        updated_timestamp: null
      };
      commentToAdd.push(newComment);
    }
    return blogCommentService.addMany(commentToAdd);
  }

  // data
  getNames() {
    return ['Admin admin', 'User user'];
  }

  getBlogCategories() {
    return ['Blog Category 1', 'Blog Category 2'];
  }

  getBlogs() {
    return [
      {
        title: 'Blog 1',
        blog_text: 'Blog 1 Sample text'
      },
      {
        title: 'Blog 2',
        blog_text: 'Blog 2 Sample text'
      }];
  }

  getComments() {
    return [
      {
        title: 'Blog Comment 1',
        comment_text: 'Blog Sample comment 1 text'
      },
      {
        title: 'Blog Comment 2',
        comment_text: 'Blog Sample comment 2text'
      }];
  }
}

module.exports = SeedService;
