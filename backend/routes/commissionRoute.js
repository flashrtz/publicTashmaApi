import express from "express";
import mysqlConnection from "../mysql.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    mysqlConnection.query(
      `CALL GetAllCommissons();`,
      (error, results, fields) => {
        if (error) {
          mysqlConnection.rollback();
          res.status(500).send("Error while getting all commissons");
        }
        res.send(results[0]);
      }
    );
  } catch (err) {
    console.log(err);
    res.status(400).send(err.message);
  }
});

router.post("/usercommission", async (req, res) => {
  try {
    var epfnumber = req.body.epfnumber;
    var month = req.body.month;
    var year = req.body.year;

    mysqlConnection.beginTransaction((err) => {
      if (err) {
        mysqlConnection.rollback();
        res.status(500).send("Error while getting user commissons");
      }
      mysqlConnection.query(
        `CALL GetUserCommissonsByMonthYear(${month},${year},'${epfnumber}');`,
        (error, results, fields) => {
          if (error) {
            mysqlConnection.rollback();
            res.status(500).send("Error while getting user commissons");
          }
          console.log(results);
          res.send(results[0]);
        }
      );
    });
  } catch (err) {
    console.log(err);
    res.status(400).send(err.message);
  }
});

export default router;
