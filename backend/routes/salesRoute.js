import express from "express";
import mysqlConnection from "../mysql";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    mysqlConnection.query(
      `CALL GetAllCommissons();`,
      (error, results, fields) => {
        if (error) {
          mysqlConnection.rollback();
          res.status(500).send("Error while gettig all commissions");
        }
        res.send(results[0]);
      }
    );
  } catch (err) {
    console.log(err);
    res.status(400).send(err.message);
  }
});

router.post("/sales", async (req, res) => {
  try {
    var month = req.body.month;
    var year = req.body.year;

    mysqlConnection.beginTransaction((err) => {
      if (err) {
        mysqlConnection.rollback();
        res.status(500).send("Error while getting commissions");
      }
      mysqlConnection.query(
        `CALL GetUserCommissonsByMonthYear(${month},${year}');`,
        (error, results, fields) => {
          if (error) {
            mysqlConnection.rollback();
            res.status(500).send("Error while getting commissions");
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
