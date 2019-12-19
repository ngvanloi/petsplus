var MongoClient = require("mongodb").MongoClient;
var url =
  "mongodb+srv://Noine:noinoinoi@cluster0-2yqds.mongodb.net/PetsPlusStore";
var AdminDAO = {
  selectByUsernameAndPassword: function(username, password) {
    return new Promise(function(resolve, reject) {
      MongoClient.connect(url, function(err, db) {
        if (err) reject(err);
        var dbo = db.db("PetsPlusStore");
        var query = { username: username, password: password };
        dbo.collection("Admin").findOne(query, function(err, res) {
          if (err) reject(err);
          resolve(res);
          db.close();
        });
      });
    });
  }
};

module.exports = AdminDAO;
