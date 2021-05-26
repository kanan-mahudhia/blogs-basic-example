const BaseRepository = require('../../../db/baseRepository');

class BlogCategoryRepository extends BaseRepository {
  constructor() {
    super('cl_blog_category');
  }

  //get all blog categories
  getAllBlogCategories() {
    return this.dbClient
      .then(db => db
        .collection(this.collection)
        .aggregate([
          { $sort: { created_timestamp: -1 } }
        ])
        .toArray()
      )
      .then(result => {
        return result;
      });
  }

}

module.exports = BlogCategoryRepository;
