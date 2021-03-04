import express from "express";
import mysqlConnection from "../mysql.js";

const router = express.Router();

router.post("/signin", async (req, res) => {

  try {
    var epfnumber = req.body.epfnumber;
    var password = req.body.password;
    
    mysqlConnection.beginTransaction((err) => {
      if (err) {
        mysqlConnection.rollback();
        res.status(500).send("Error while signing in");
      }
      mysqlConnection.query(
        `CALL SignIn('${epfnumber}','${password}');`,
        (error, results, fields) => {
          if (error) {
            mysqlConnection.rollback();
            res.status(500).send("Error while signing in");
          }
          if (results[0][0].LoginStatus == 0) {
            res.send({ login: false });
          }
          if (results[0][0].LoginStatus == 1) {
            res.send({
              login: true,
              isAdmin: results[0][0].IsAdmin == 1 ? true : false,
            });
          }
        }
      );
    });
  } catch (err) {
    console.log(err);
    res.status(400).send(err.message);
  }
});

router.get("/", async (req, res) => {
  try {
    mysqlConnection.query(`CALL GetAllUsers();`, (error, results, fields) => {
      if (error) {
        mysqlConnection.rollback();
        res.status(500).send("Error while getting all users");
      }
      res.send(results[0]);
    });
  } catch (err) {
    console.log(err);
    res.status(400).send(err.message);
  }
});

router.get("/:id", async (req, res) => {
  try {
    mysqlConnection.query(
      `CALL GetUserById(${req.params.id});`,
      (error, results, fields) => {
        if (error) {
          mysqlConnection.rollback();
          res.status(500).send("Error while getting user");
        }
        res.send(results[0]);
      }
    );
  } catch (err) {
    console.log(err);
    res.status(400).send(err.message);
  }
});

router.post("/", async (req, res) => {
  try {
    var Name = req.body.Name;
    var Description = req.body.Description;
    var NIC = req.body.NIC;
    var EPFNumber = req.body.EPFNumber;
    var IsAdmin = req.body.IsAdmin;
    mysqlConnection.beginTransaction((err) => {
      if (err) {
      mysqlConnection.rollback();
      res.status(500).send("Error while creating user");
    }
      mysqlConnection.query(
        `CALL CreateUser('${Name}','${Description}', '${NIC}', '${EPFNumber}', '${IsAdmin}');`,
        (error, results, fields) => {
          if (error) {
            mysqlConnection.rollback();
            res.status(500).send("Error while creating user");
          }
        }
      );
      mysqlConnection.commit((err) => {
        if (err) {
          mysqlConnection.rollback();
          res.status(500).send("Error while creating user");
        }
        console.log("success!");
        res.send({ message: "User Created." });
      });
    });
  } catch (err) {
    console.log(err);
    res.status(400).send(err.message);
  }
});

router.put("/", async (req, res) => {
  try {
    var UserId = req.body.UserId;
    var Name = req.body.Name;
    var Description = req.body.Description;
    var NIC = req.body.NIC;
    var EPFNumber = req.body.EPFNumber;
    // var IsAdmin = req.body.IsAdmin;
    mysqlConnection.beginTransaction((err) => {
      if (err) {
         mysqlConnection.rollback();
            res.status(500).send("Error while editing user");
      }
      mysqlConnection.query(
        `CALL EditUser('${UserId}', '${Name}','${Description}', '${NIC}', '${EPFNumber}');`,
        (error, results, fields) => {
          if (error) {
            mysqlConnection.rollback();
            res.status(500).send("Error while editing user");
          }
        }
      );
      mysqlConnection.commit((err) => {
        if (err) {
          mysqlConnection.rollback();
            res.status(500).send("Error while editing user");
        }
        console.log("success!");
        res.send({ message: "User Edited." });
      });
    });
  } catch (err) {
    console.log(err);
    res.status(400).send(err.message);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    var UserId = req.params.id;
    mysqlConnection.beginTransaction((err) => {
      if (err) {
        mysqlConnection.rollback();
        res.status(500).send("Error while deleting user");
      }
      mysqlConnection.query(
        `CALL DeleteUser(${UserId});`,
        (error, results, fields) => {
          if (error) {
            mysqlConnection.rollback();
            res.status(500).send("Error while deleting user");
          }
        }
      );
      mysqlConnection.commit((err) => {
        if (err) {
          mysqlConnection.rollback();
        res.status(500).send("Error while deleting user");
        }
        console.log("success!");
        res.send({ message: "User Deleted." });
      });
    });
  } catch (err) {
    console.log(err);
    res.status(400).send(err.message);
  }
});

export default router;
