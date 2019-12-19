var router = require("express").Router();

var multer = require("multer");
var upload = multer({});

var ToyDAO = require("../DAO/ToyDAO.js");
var OrderDAO = require("../DAO/OrderDAO.js");
var NEWSDAO = require("../DAO/NEWSDAO.js");
var AdminDAO = require("../DAO/AdminDAO.js");

router.get("/", function(req, res) {
  res.redirect("/admin/home");
});
router.get("/home", function(req, res) {
  if (req.session.admin) {
    res.render("admin/home.ejs");
  } else {
    res.redirect("/admin/login");
  }
});

router.post("/addtoy", upload.single("fileImage"), async function(req, res) {
  var name = req.body.txtName;
  var description = req.body.txtDescription;
  var price = parseInt(req.body.txtPrice);
  var animal = req.body.txtAnimal;
  if (req.file) {
    var image = req.file.buffer.toString("base64");
    var toy = {
      name: name,
      price: price,
      image: image,
      description: description,
      animal: animal
    };
    var result = await ToyDAO.insert(toy);
    if (result) {
      res.redirect("/admin/listtoy");
    } else {
      res.send("SORRY BABY!");
    }
  }
});

router.get("/listorders", async function(req, res) {
  var orders = await OrderDAO.getAll();
  var id = req.query.id;
  var order = await OrderDAO.getDetails(id);
  res.render("admin/listorders.ejs", { orders: orders, order: order });
});

router.get("/addnews", function(req, res) {
  res.render("admin/addnews.ejs");
});

router.post("/addnews", upload.single("fileImage"), async function(req, res) {
  var title = req.body.txtTitle;
  var content = req.body.txtContent;
  if (req.file) {
    var image = req.file.buffer.toString("base64");
    var news = {
      title: title,
      content: content,
      image: image
    };
    var result = await NEWSDAO.insert(news);
    if (result) {
      res.send("OK BABY!");
    } else {
      res.send("SORRY BABY!");
    }
  }
});

router.get("/login", function(req, res) {
  res.render("admin/login.ejs");
});
router.post("/login", async function(req, res) {
  var username = req.body.txtUsername;
  var password = req.body.txtPassword;
  var admin = await AdminDAO.selectByUsernameAndPassword(username, password);
  if (admin) {
    req.session.admin = admin;
    res.redirect("/admin/home");
  } else {
    res.redirect("/admin/login");
  }
});

router.get("/logout", function(req, res) {
  delete req.session.admin;
  res.redirect("./home");
});
router.get("/listtoy", async function(req, res) {
  var toys = await ToyDAO.getAll();

  res.render("admin/listtoy.ejs", { toys: toys });
});

router.get("/updatetoy/:id", async function(req, res) {
  var id = req.params.id;
  var toy = await ToyDAO.getDetails(id);
  res.render("admin/updatetoy.ejs", { toy: toy });
});

router.post("/updatetoy", upload.single("fileImage"), async function(req, res) {
  var id = req.body.txtId;
  var name = req.body.txtName;
  var price = parseInt(req.body.txtPrice);
  var description = req.body.txtDescription;
  var animal = req.body.txtAnimal;
  if (req.file) {
    var image = req.file.buffer.toString("base64");
    var toy = {
      id: id,
      name: name,
      price: price,
      description: description,
      animal: animal,
      image: image
    };
    var result = await ToyDAO.update(toy);
    if (result) {
      res.redirect("/admin/listtoy");
    } else {
      res.send("SORRY BABY!");
    }
  }
});

router.get("/removetoy/:id", async function(req, res) {
  var id = req.params.id;
  var result = await ToyDAO.delete(id);
  if (result) {
    res.redirect("/admin/listtoy");
  } else {
    res.send("SORRY BABY!");
  }
});

router.get("/detail/:id", async function(req, res) {
  var id = req.params.id;
  var toy = await ToyDAO.getDetails(id);
  res.render("admin/viewtoy.ejs", { toy: toy });
});

router.get("/updateorder", async function(req, res) {
  // /updatestatus?status=XXX&id=XXX
  await OrderDAO.update(req.query.id, req.query.status);
  res.redirect("/admin/listorders");
});
module.exports = router;
