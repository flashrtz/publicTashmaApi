import express from "express";
import mysqlConnection from "../mysql.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    mysqlConnection.query(
      `CALL GetPaymentMethods();`,
      (error, results, fields) => {
        if (error) {
          mysqlConnection.rollback();
          return res.status(500).send("Error while getting payment methods");
        }
        if (results[0] == null) {
          return res.send("No Payment Method records to be returned");
        }
        if (results[0] != null) {
          return res.send(results[0]);
        }
      }
    );
  } catch (err) {
    console.log(err);
    res.status(400).send(err.message);
  }
});

export default router;
