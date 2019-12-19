var MongoClient = require("mongodb").MongoClient;
var url =
  "mongodb+srv://Noine:noinoinoi@cluster0-2yqds.mongodb.net/PetsPlusStore";
var CustomerDAO = {
  selectByUsernameAndPassword: function(username, password) {
    return new Promise(function(resolve, reject) {
      MongoClient.connect(url, function(err, db) {
        if (err) reject(err);
        var dbo = db.db("PetsPlusStore");
        var query = { username: username, password: password };
        dbo.collection("Customer").findOne(query, function(err, res) {
          if (err) reject(err);
          resolve(res);
          db.close();
        });
      });
    });
  },
  selectByUsernameOrEmail: function(username, email) {
    return new Promise(function(resolve, reject) {
      MongoClient.connect(url, function(err, db) {
        if (err) reject(err);
        var dbo = db.db("PetsPlusStore");
        var query = { $or: [{ username: username }, { email: email }] };
        dbo.collection("Customer").findOne(query, function(err, res) {
          if (err) reject(err);
          resolve(res);
          db.close();
        });
      });
    });
  },
  insert: function(customer) {
    return new Promise(function(resolve, reject) {
      MongoClient.connect(url, function(err, db) {
        if (err) reject(err);
        var dbo = db.db("PetsPlusStore");
        dbo.collection("Customer").insertOne(customer, function(err, res) {
          if (err) reject(err);
          resolve(res.insertedCount > 0 ? res.insertedId : null);
          db.close();
        });
      });
    });
  },
  active: function(id, token) {
    return new Promise(function(resolve, reject) {
      MongoClient.connect(url, function(err, db) {
        if (err) reject(err);
        var dbo = db.db("PetsPlusStore");
        var ObjectId = require("mongodb").ObjectId;
        var query = { _id: ObjectId(id), token: token };
        var newvalues = { $set: { active: 1 } };
        dbo
          .collection("Customer")
          .updateOne(query, newvalues, function(err, res) {
            if (err) reject(err);
            resolve(res.result.nModified > 0 ? true : false);
            db.close();
          });
      });
    });
  }
};

module.exports = CustomerDAO;
