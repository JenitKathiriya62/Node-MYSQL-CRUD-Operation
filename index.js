var con = require("./connection");
var express = require("express");
var bodyparser = require("body-parser");

var app = express();

app.use(bodyparser.json());

app.use(bodyparser.urlencoded({ extended: true }));

app.set("view engine", "ejs");

app.get("/", function (req, res) {
  return res.sendFile(__dirname + "/register.html");
});

app.post("/", function (req, res) {
  var name = req.body.name;
  var email = req.body.email;
  var mno = req.body.mno;

  con.connect(function (error) {
    console.log(error);

    var sql = "INSERT INTO students(name,email,mno) VALUES ?";
    var values = [[name, email, mno]];

    con.query(sql, [values], function (error, result) {
      if (error) console.log(error);

      return res.send("Data inserted Successfull");
    });
  });
});

app.get("/students", function (req, res) {
  con.connect(function (error) {
    if (error) console.log(error);

    var sql = "select * from students";
    con.query(sql, function (error, result) {
      if (error) console.log(error);
      return res.render(__dirname + "/students", { students: result });
    });
  });
});

app.get("/delete-student", function (req, res) {
  con.connect(function (error) {
    if (error) console.log(error);
    var id = req.query.id;
    var sql = "DELETE from students where id= ?";
    con.query(sql, [id], function (error, result) {
      if (error) console.log(error);

      return res.send("Student Record Deleted");
    });
  });
});

app.get("/update-student", function (req, res) {
  con.connect(function (error) {
    if (error) console.log(error);

    var id = req.query.id;
    var sql = "SELECT * from students where id = ?";

    con.query(sql, [id], function (error, result) {
      if (error) console.log(error);
      return res.render(__dirname + "/update-students", { students: result });
    });
  });
});

app.post("/update-student", function (req, res) {
  con.connect(function (error) {
    if (error) console.log(error);

    var id = req.body.id;
    var name = req.body.name;
    var email = req.body.email;
    var mno = req.body.mno;

    var sql = "UPDATE students set name=?, email=?, mno=? where id=?";

    con.query(sql, [name, email, mno, id], function (error, result) {
      if (error) console.log(error);
      return res.send("Data Updated");
    });
  });
});

app.get("/search-students", function (req, res) {
  con.connect(function (error) {
    if (error) console.log(error);

    var sql = "select * from students";
    con.query(sql, function (error, result) {
      if (error) console.log(error);
      return res.render(__dirname + "/search-students", { students: result });
    });
  });
});

app.get("/searching", function (req, res) {
  var name = req.query.name;
  var email = req.query.email;
  var mno = req.query.mno;

  con.connect(function (error) {
    if (error) console.log(error);

    var sql =
      "SELECT * from students where name LIKE '%" +
      name +
      "%' AND email LIKE '%" +  
      email +
      "%' AND mno LIKE '%" +
      mno +
      "%'";
    con.query(sql, function (error, result) {
      if (error) console.log(error);
      return res.send(result);
    });
  });
});

app.listen(7000);
