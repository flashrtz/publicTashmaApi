import express from "express";
import mysqlConnection from "../mysql.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    mysqlConnection.query(
      `CALL GetAllBillBooks();`,
      (error, results, fields) => {
        if (error) {
          mysqlConnection.rollback();
          return res.status(500).send("Error while getting all bill books");
        }
        if (results[0] == null || results[0] == undefined) {
          return res.send("No bill book records to be returned");
        }
        if (results[0] != null || results[0] != undefined) {
          return res.send(results[0]);
        }
      }
    );
  } catch (err) {
    console.log(err);
    res.status(400).send(err.message);
  }
});

router.post("/", async (req, res) => {
  try {
      console.log(req.body,"!!!!!!!!!!!!!!!!!!!")
    var BillBookName = req.body.BillBookName;
    mysqlConnection.beginTransaction((err) => {
      if (err) {
        mysqlConnection.rollback();
        return res.status(500).send("Error while creating bill book(first)");
      }
      mysqlConnection.query(
        `CALL CreateBillBook('${BillBookName}');`,
        (error, results, fields) => {
          if (error) {
            mysqlConnection.rollback();
            return res.status(500).send("Error while creating bill book (Create Bill Book)");
          }
        }
      );
      mysqlConnection.commit((err) => {
        if (err) {
          mysqlConnection.rollback();
          return res.status(500).send("Error while creating category");
        }
        return res.send({ message: "Bill book Created." });
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
    mysqlConnection.beginTransaction((err) => {
      if (err) {
        mysqlConnection.rollback();
        return res.status(500).send("Error while editing category");
      }
      mysqlConnection.query(
        `CALL EditCategory(${CategoryId},'${CategoryName}');`,
        (error, results, fields) => {
          if (error) {
            mysqlConnection.rollback();
            return res.status(500).send("Error while editing category");
          }
        }
      );
      mysqlConnection.commit((err) => {
        if (err) {
          mysqlConnection.rollback();
          return res.status(500).send("Error while editing category");
        }
        return res.send({ message: "Category Edited." });
      });
    });
  } catch (err) {
    console.log(err);
    res.status(400).send(err.message);
  }
});

export default router;
