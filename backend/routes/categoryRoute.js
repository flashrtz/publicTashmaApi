import express from "express";
import mysqlConnection from "../mysql.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    mysqlConnection.query(`CALL GetAllCategories();`, (error, results, fields) => {
      if (error) {
        return mysqlConnection.rollback(() => {
          throw error;
        });
      }
      var orders = results;
      res.send(orders[0]);
    });
  } catch (err) {
    console.log(err);
    res.status(400).send(err.message);
  }
});


router.post("/", async (req, res) => {
  try {
    var CategoryName = req.body.CategoryName;
    mysqlConnection.beginTransaction((err) => {
      if (err) {
        throw err;
      }
      mysqlConnection.query(
        `CALL CreateCategory('${CategoryName}');`,
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
        res.send({ message: "Category Created." });
      });
    });
  } catch (err) {
    console.log(err);
    res.status(400).send(err.message);
  }
});

router.put("/", async (req, res) => {
  try {
    var CategoryId = req.body.CategoryId;
    var CategoryName = req.body.CategoryName;
    // console.log(OrderId);
    mysqlConnection.beginTransaction((err) => {
      if (err) {
        throw err;
      }
      mysqlConnection.query(
        `CALL EditCategory(${CategoryId},'${CategoryName}');`,
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
        res.send({ message: "Category Edited." });
      });
    });
  } catch (err) {
    console.log(err);
    res.status(400).send(err.message);
  }
});

export default router;
