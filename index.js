var app = require("express")();

app.listen(process.env.PORT || 3000);

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

var session = require("express-session");
app.use(session({ secret: "Noine@noinoinoi" }));

var cookieParser = require("cookie-parser");
app.use(cookieParser());

app.use(function(req, res, next) {
  res.locals.session = req.session;
  next();
});

app.set("view engine", "ejs");
app.set("views", "./views");

app.use("/", require("./routes/customer.js"));
app.use("/admin", require("./routes/admin.js"));
