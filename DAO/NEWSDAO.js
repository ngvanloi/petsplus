var MongoClient = require("mongodb").MongoClient;
var url =
  "mongodb+srv://Noine:noinoinoi@cluster0-2yqds.mongodb.net/PetsPlusStore";
var NEWSDAO = {
  insert: function(toy) {
    return new Promise(function(resolve, reject) {
      MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("PetsPlusStore");
        dbo.collection("NEWS").insertOne(toy, function(err, res) {
          if (err) return reject(err);
          resolve(res.insertedCount > 0 ? true : false);
          db.close();
        });
      });
    });
  },
  getAll: function() {
    return new Promise(function(resolve, reject) {
      MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("PetsPlusStore");
        var query = {};
        dbo
          .collection("NEWS")
          .find(query)
          .toArray(function(err, res) {
            if (err) return reject(err);
            resolve(res);
            db.close();
          });
      });
    });
  },
  getDetails: function(id) {
    return new Promise(function(resolve, reject) {
      MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("PetsPlusStore");
        var ObjectId = require("mongodb").ObjectId;
        var query = { _id: ObjectId(id) };
        dbo.collection("NEWS").findOne(query, function(err, res) {
          if (err) return reject(err);
          resolve(res);
          db.close();
        });
      });
    });
  }
};
module.exports = NEWSDAO;
