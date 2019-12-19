var MongoClient = require("mongodb").MongoClient;
var url =
  "mongodb+srv://Noine:noinoinoi@cluster0-2yqds.mongodb.net/PetsPlusStore";
var ToyDAO = {
  insert: function(toy) {
    return new Promise(function(resolve, reject) {
      MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("PetsPlusStore");
        dbo.collection("Toys").insertOne(toy, function(err, res) {
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
          .collection("Toys")
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
        dbo.collection("Toys").findOne(query, function(err, res) {
          if (err) return reject(err);
          resolve(res);
          db.close();
        });
      });
    });
  },
  getAnimal: function(animal) {
    return new Promise(function(resolve, reject) {
      MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("PetsPlusStore");
        var query = { animal: animal };

        dbo
          .collection("Toys")
          .find(query)
          .toArray(function(err, res) {
            if (err) return reject(err);
            resolve(res);
            db.close();
          });
      });
    });
  },
  update: function(toy) {
    return new Promise(function(resolve, reject) {
      MongoClient.connect(url, function(err, db) {
        if (err) reject(err);
        var dbo = db.db("PetsPlusStore");
        var ObjectId = require("mongodb").ObjectId;
        var query = { _id: ObjectId(toy.id) };
        var newvalues = {
          $set: {
            name: toy.name,
            price: toy.price,
            description: toy.description,
            image: toy.image,
            animal: toy.animal
          }
        };
        dbo.collection("Toys").updateOne(query, newvalues, function(err, res) {
          if (err) reject(err);
          resolve(res.result.nModified > 0 ? true : false);
          db.close();
        });
      });
    });
  },
  delete: function(id) {
    return new Promise(function(resolve, reject) {
      MongoClient.connect(url, function(err, db) {
        if (err) reject(err);
        var dbo = db.db("PetsPlusStore");
        var ObjectId = require("mongodb").ObjectId;
        var query = { _id: ObjectId(id) };
        dbo.collection("Toys").deleteOne(query, function(err, res) {
          if (err) reject(err);
          resolve(res.result.n > 0 ? true : false);
          db.close();
        });
      });
    });
  },
  search: function(keyword) {
    return new Promise(function(resolve, reject) {
      MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("PetsPlusStore");
        var query = {
          $or: [
            { name: { $regex: new RegExp(keyword, "i") } },
            { animal: { $regex: new RegExp(keyword, "i") } }
          ]
        };
        dbo
          .collection("Toys")
          .find(query)
          .toArray(function(err, res) {
            if (err) return reject(err);
            resolve(res);
            db.close();
          });
      });
    });
  }
};
module.exports = ToyDAO;
