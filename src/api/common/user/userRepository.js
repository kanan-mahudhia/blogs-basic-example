const { ObjectID } = require('mongodb');

const BaseRepository = require('../../../db/baseRepository');

class UserRepository extends BaseRepository {
  constructor() {
    super('cl_user');
  }

  // user email confirmation
  confirm_user(email, token) {
    console.log(email);
    return this.dbClient
      .then(db => db
        .collection(this.collection)
        .aggregate([
          { $match: { email: email, verification_token: token } },
          { $sort: { name: -1 } }
        ])
        .toArray()
      )
      .then(data => {
        if (data.length > 0) {
          return this.dbClient
            .then(db => db
              .collection(this.collection)
              .updateOne({ _id: data[0]._id },
                { $set: { is_verified: true } })
            )
            .then(() => { return 'Your email has been verified successfully!.'; });
        } else {
          return 'Invalid user';
        }
      });
  }

  // get all users
  getAllUsers() {
    return this.dbClient
      .then(db => db
        .collection(this.collection)
        .aggregate([
          {

            $group:
            {
              _id: "$_id",
              first_name: { $first: "$first_name" },
              last_name: { $first: "$last_name" },
              email: { $first: "$email" },
              created_timestamp: { $first: "$created_timestamp" },
              updated_timestamp: { $first: "$updated_timestamp" }
            }
          },
          { $sort: { name: -1 } }
        ])
        .toArray()
      )
      .then(data => {
        return data;
      });
  }

  // get user by id
  findById(id) {
    return this.dbClient
      .then(db => db
        .collection(this.collection)
        .aggregate([
          { $match: { _id: ObjectID(id) } },
          {
            $group:
            {
              _id: "$_id",
              first_name: { $first: "$first_name" },
              last_name: { $first: "$last_name" },
              email: { $first: "$email" },
              created_timestamp: { $first: "$created_timestamp" },
              updated_timestamp: { $first: "$updated_timestamp" }
            }
          },
          { $sort: { name: -1 } }
        ])
        .toArray()
      )
      .then(data => {
        return data
      });
  }

  // get user by email
  findByEmail(email) {
    return this.dbClient
      .then(db => db
        .collection(this.collection)
        .findOne({ email }));
  }

  // change user password
  changePassword(id, salt, passwordHash) {
    return this.dbClient
      .then(db => db
        .collection(this.collection)
        .updateOne({ _id: ObjectID(id) }, { $set: { salt, passwordHash } }));
  }

  listFiltered(filter) {
    filter.query = {};

    // names here are not fully consistent with naming convention for compatibility with ng2-smart-table api on UI
    if (filter.filterByfirstName) {
      filter.query.firstName = { $regex: filter.filterByfirstName, $options: '-i' };
    }
    if (filter.filterBylastName) {
      filter.query.lastName = { $regex: filter.filterBylastName, $options: '-i' };
    }
    if (filter.filterByuserName) {
      filter.query.fullName = { $regex: filter.filterByuserName, $options: '-i' };
    }
    if (filter.filterByemail) {
      filter.query.email = { $regex: filter.filterByemail, $options: '-i' };
    }
    return super.listFiltered(filter);
  }

}

module.exports = UserRepository;
