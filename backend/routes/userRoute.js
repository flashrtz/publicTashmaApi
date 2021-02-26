import express from "express";
import mysqlConnection from "../mysql.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    mysqlConnection.query(`CALL GetAllUsers();`, (error, results, fields) => {
      if (error) {
        return mysqlConnection.rollback(() => {
          throw error;
        });
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
          return mysqlConnection.rollback(() => {
            throw error;
          });
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
        throw err;
      }
      mysqlConnection.query(
        `CALL CreateUser('${Name}','${Description}', '${NIC}', '${EPFNumber}', '${IsAdmin}');`,
        (error, results, fields) => {
          if (error) {
            return mysqlConnection.rollback(() => {
              throw error;
            });
          }
        }
      );
      mysqlConnection.commit((err) => {
        if (err) {
          return mysqlConnection.rollback(() => {
            throw err;
          });
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
    var IsAdmin = req.body.IsAdmin;;
    mysqlConnection.beginTransaction((err) => {
      if (err) {
        throw err;
      }
      mysqlConnection.query(
        `CALL EditUser('${UserId}', '${Name}','${Description}', '${NIC}', '${EPFNumber}', '${IsAdmin}');`,
        (error, results, fields) => {
          if (error) {
            return mysqlConnection.rollback(() => {
              throw error;
            });
          }
        }
      );
      mysqlConnection.commit((err) => {
        if (err) {
          return mysqlConnection.rollback(() => {
            throw err;
          });
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

router.delete("/", async (req, res) => {
  try {
    var UserId = req.body.UserId;
    mysqlConnection.beginTransaction((err) => {
      if (err) {
        throw err;
      }
      mysqlConnection.query(
        `CALL DeleteUser(${UserId});`,
        (error, results, fields) => {
          if (error) {
            return mysqlConnection.rollback(() => {
              throw error;
            });
          }
        }
      );
      mysqlConnection.commit((err) => {
        if (err) {
          return mysqlConnection.rollback(() => {
            throw err;
          });
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

router.post("/signin", async (req, res) => {
  try {
    var epfnumber = req.body.epfnumber;
    var password = req.body.password;

    mysqlConnection.beginTransaction((err) => {
      if (err) {
        throw err;
      }
      mysqlConnection.query(
        `CALL SignIn('${epfnumber}','${password}');`,
        (error, results, fields) => {
          if (error) {
            return mysqlConnection.rollback(() => {
              throw error;
            }); 
          }
          console.log(results);
          if (results[0][0].LoginStatus == 0) {
            res.send({ login: false });
          }
          if (results[0][0].LoginStatus == 1) {
            res.send({ login: true, isAdmin: results[0][0].IsAdmin == 1 ? true : false });
          }
        }
      );
    });
  } catch (err) {
    console.log(err);
    res.status(400).send(err.message);
  }
});

export default router;
