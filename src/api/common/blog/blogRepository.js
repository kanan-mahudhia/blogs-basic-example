const BaseRepository = require('../../../db/baseRepository');

class BlogRepository extends BaseRepository {
  constructor() {
    super('cl_blog');
  }

  //get all blogs
  getAllBlogs() {
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
              // pipeline: [
              //   { $project: { passwordHash: 0, salt: 0 } }],
              as: "user_data"
            }
          },{
            $project: {
              "user_data.passwordHash": 0,
              "user_data.salt": 0
            }
          },
          {
            $lookup:
            {
              from: "cl_blog_category",
              localField: "blog_cat_id",
              foreignField: "_id",
              as: "blog_cat_data"
            }
          },
          {
            $lookup:
            {
              from: "cl_comment",
              localField: "_id",
              foreignField: "blog_id",
              as: "blog_comments"
            }
          },
          {
            $unwind: {
              "path": "$blog_comments",
              "preserveNullAndEmptyArrays": true
            }
          },
          {
            $lookup:
            {
              from: "cl_user",
              localField: "blog_comments.user_id",
              foreignField: "_id",
              as: "blog_comment_user_data"
            }
          },
          {
            $unwind: {
              "path": "$blog_comment_user_data",
              "preserveNullAndEmptyArrays": true
            }
          },
          {
            $project: {
              "blog_comment_user_data.passwordHash": 0,
              "blog_comment_user_data.salt": 0
            }
          },
          {
            $group:
            {
              _id: "$_id",
              user_id: { $first: "$user_id" },
              user_data: { $addToSet: { $arrayElemAt: ["$user_data", 0] } },
              blog_cat_id: { $first: "$blog_cat_id" },
              blog_cat_data: { $addToSet: { $arrayElemAt: ["$blog_cat_data", 0] } },
              blog_comments: {
                $push: {
                  "_id": "$blog_comments._id",
                  "title": "$blog_comments.title",
                  "comment_text": "$blog_comments.comment_text",
                  "blog_id": "$blog_comments.blog_id",
                  "user_id": "$blog_comments.user_id",
                  "user_data": "$blog_comment_user_data",
                  "created_timestamp": "$blog_comments.created_timestamp",
                  "updated_timestamp": "$blog_comments.updated_timestamp",
                }
              },
              title: { $first: "$title" },
              blog_text: { $first: "$blog_text" },
              created_timestamp: { $first: "$created_timestamp" },
              updated_timestamp: { $first: "$updated_timestamp" },
            },
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

module.exports = BlogRepository;
