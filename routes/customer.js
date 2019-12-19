var router = require("express").Router();

var ToyDAO = require("../DAO/ToyDAO.js");
var OrderDAO = require("../DAO/OrderDAO.js");
var NEWSDAO = require("../DAO/NEWSDAO.js");
var CustomerDAO = require("../DAO/CustomerDAO.js");

router.get("/", function(req, res) {
  res.redirect("/home");
});
router.get("/home", async function(req, res) {
  var dogs = await ToyDAO.getAnimal("cho");
  var cats = await ToyDAO.getAnimal("meo");
  var news = await NEWSDAO.getAll();

  res.render("customer/home.ejs", { dogs: dogs, cats: cats, news: news });
});
router.get("/viewtoy/:id", async function(req, res) {
  var id = req.params.id;
  var toy = await ToyDAO.getDetails(id);
  res.render("customer/viewtoy.ejs", { toy: toy });
});

router.post("/add2cart", async function(req, res) {
  var id = req.body.txtID;
  var toy = await ToyDAO.getDetails(id);
  var quantity = parseInt(req.body.txtQuantity);

  var mycart = [];

  if (req.session.mycart) {
    mycart = req.session.mycart;
  }

  var index = mycart.findIndex(x => x.toy._id == id);
  if (index == -1) {
    var newItem = { toy: toy, quantity: quantity };
    mycart.push(newItem);
  } else {
    mycart[index].quantity += quantity;
  }

  req.session.mycart = mycart;

  res.redirect("/home");
});

router.get("/mycart", function(req, res) {
  if (req.session.mycart && req.session.mycart.length > 0) {
    res.render("customer/mycart.ejs");
  } else {
    res.redirect("/home");
  }
});

router.get("/remove2cart/:id", function(req, res) {
  var id = req.params.id;
  if (req.session.mycart) {
    var mycart = req.session.mycart;
    var index = mycart.findIndex(x => x.toy._id == id);
    if (index != -1) {
      // found, remove item
      mycart.splice(index, 1);
      req.session.mycart = mycart;
    }
  }
  res.redirect("/mycart");
});

router.get("/checkout", function(req, res) {
  if (req.session.mycart && req.session.mycart.length > 0) {
    res.render("customer/checkout.ejs");
  } else {
    res.redirect("/home");
  }
});

router.post("/checkout", async function(req, res) {
  var custName = req.body.txtCustName;
  var custPhone = req.body.txtCustPhone;
  var now = new Date().getTime(); // milliseconds
  var total = 0;
  for (var item of req.session.mycart) {
    total += item.toy.price * item.quantity;
  }
  var order = {
    custName: custName,
    custPhone: custPhone,
    datetime: now,
    items: req.session.mycart,
    total: total,
    status: "PENDING"
  };
  var result = await OrderDAO.insert(order);
  if (result) {
    delete req.session.mycart;
    res.redirect("/home");
  } else {
    res.redirect("/mycart");
  }
});

router.get("/viewnews/:id", async function(req, res) {
  var id = req.params.id;
  var news = await NEWSDAO.getDetails(id);
  res.render("customer/viewnews.ejs", { news: news });
});

router.get("/signup", function(req, res) {
  res.render("customer/signup.ejs");
});
router.post("/signup", async function(req, res) {
  var username = req.body.txtUsername;
  var password = req.body.txtPassword;
  var name = req.body.txtName;
  var phone = req.body.txtPhone;
  var email = req.body.txtEmail;
  var dbCust = await CustomerDAO.selectByUsernameOrEmail(username, email);
  if (dbCust) {
    res.send("EXISTS USERNAME OR EMAIL!");
  } else {
    var newCust = {
      username: username,
      password: password,
      name: name,
      phone: phone,
      email: email,
      active: 1
    };
    var newID = await CustomerDAO.insert(newCust);
    if (newID) {
      res.redirect("./login");
    } else {
      res.redirect("./signup");
    }
  }
});

router.get("/login", function(req, res) {
  res.render("customer/login.ejs");
});
router.post("/login", async function(req, res) {
  var username = req.body.txtUsername;
  var password = req.body.txtPassword;

  var customer = await CustomerDAO.selectByUsernameAndPassword(
    username,
    password
  );

  if (customer && customer.active == 1) {
    req.session.customer = customer;
    res.redirect("./home");
  } else {
    res.redirect("./login");
  }
});
router.get("/logout", function(req, res) {
  delete req.session.customer;
  res.redirect("./home");
});
router.post("/search", async function(req, res) {
  var text = req.body.txtSearch;
  var searchs = await ToyDAO.search(text);
  res.render("customer/search.ejs", { searchs: searchs });
});
module.exports = router;
