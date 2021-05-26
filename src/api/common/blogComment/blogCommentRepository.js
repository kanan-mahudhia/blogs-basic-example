const { ObjectID } = require('mongodb');

const BaseRepository = require('../../../db/baseRepository');

class BlogCommentRepository extends BaseRepository {
  constructor() {
    super('cl_comment');
  }

  //get all blog comments
  getAllBlogComments() {
    return this.dbClient
      .then(db => db
        .collection(this.collection)
        .aggregate([
          {
            $lookup:
            {
              from: "cl_user",
              localField: "user_id",
              foreignField: "_id",
              as: "user_data"
            }
          },
          {
            $project: {
              "user_data.passwordHash": 0,
              "user_data.salt": 0
            }
          },
          {
            $lookup:
            {
              from: "cl_blog",
              localField: "blog_id",
              foreignField: "_id",
              as: "blog_data"
            }
          },
          {
            $unwind: {
              "path": "$blog_data",
              "preserveNullAndEmptyArrays": true
            }
          },
          {
            $lookup:
            {
              from: "cl_user",
              localField: "blog_data.user_id",
              foreignField: "_id",
              as: "blog_user_data"
            }
          },
          {
            $project: {
              "blog_user_data.passwordHash": 0,
              "blog_user_data.salt": 0
            }
          },
          {
            $lookup:
            {
              from: "cl_blog_category",
              localField: "blog_data.blog_cat_id",
              foreignField: "_id",
              as: "blog_cat_data"
            }
          },
          {
            $group:
            {
              _id: "$_id",
              user_id: { $first: "$user_id" },
              user_data: { $addToSet: { $arrayElemAt: ["$user_data", 0] } },
              blog_id: { $first: "$blog_id" },
              blog_data: {
                $push: {
                  "_id": "$blog_data._id",
                  "title": "$blog_data.title",
                  "blog_text": "$blog_data.blog_text",
                  "user_id": "$blog_data.user_id",
                  "user_data": "$blog_user_data",
                  "blog_cat_id": "$blog_data.blog_cat_id",
                  "blog_cat_data": "$blog_cat_data",
                  "created_timestamp": "$blog_comments.created_timestamp",
                  "updated_timestamp": "$blog_comments.updated_timestamp",
                }
              },
              title: { $first: "$title" },
              comment_text: { $first: "$comment_text" },
              created_timestamp: { $first: "$created_timestamp" },
              updated_timestamp: { $first: "$updated_timestamp" },
            }
          },
          { $sort: { created_timestamp: -1 } }
        ])
        .toArray()
      )
      .then(result => {
        return result;
      });
  }

  //get comments by blog id
  getBlogCommentsByBlog(blog_id) {
    return this.dbClient
      .then(db => db
        .collection(this.collection)
        .aggregate([
          { $match: { blog_id: ObjectID(blog_id) } },
          {
            $lookup:
            {
              from: "cl_user",
              localField: "user_id",
              foreignField: "_id",
              as: "user_data"
            }
          },
          {
            $project: {
              "user_data.passwordHash": 0,
              "user_data.salt": 0
            }
          },
          {
            $lookup:
            {
              from: "cl_blog",
              localField: "blog_id",
              foreignField: "_id",
              as: "blog_data"
            }
          },
          {
            $unwind: {
              "path": "$blog_data",
              "preserveNullAndEmptyArrays": true
            }
          },
          {
            $lookup:
            {
              from: "cl_user",
              localField: "blog_data.user_id",
              foreignField: "_id",
              as: "blog_user_data"
            }
          },
          {
            $project: {
              "blog_user_data.passwordHash": 0,
              "blog_user_data.salt": 0
            }
          },
          {
            $lookup:
            {
              from: "cl_blog_category",
              localField: "blog_data.blog_cat_id",
              foreignField: "_id",
              as: "blog_cat_data"
            }
          },
          {
            $group:
            {
              _id: "$_id",
              user_id: { $first: "$user_id" },
              user_data: { $addToSet: { $arrayElemAt: ["$user_data", 0] } },
              blog_id: { $first: "$blog_id" },
              blog_data: {
                $push: {
                  "_id": "$blog_data._id",
                  "title": "$blog_data.title",
                  "blog_text": "$blog_data.blog_text",
                  "user_id": "$blog_data.user_id",
                  "user_data": "$blog_user_data",
                  "blog_cat_id": "$blog_data.blog_cat_id",
                  "blog_cat_data": "$blog_cat_data",
                  "created_timestamp": "$blog_comments.created_timestamp",
                  "updated_timestamp": "$blog_comments.updated_timestamp",
                }
              },
              title: { $first: "$title" },
              comment_text: { $first: "$comment_text" },
              created_timestamp: { $first: "$created_timestamp" },
              updated_timestamp: { $first: "$updated_timestamp" },
            }
          },
          { $sort: { created_timestamp: -1 } }
        ])
        .toArray()
      )
      .then(result => {
        return result;
      });
  }

}

module.exports = BlogCommentRepository;
