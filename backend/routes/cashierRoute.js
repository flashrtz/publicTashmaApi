import express from "express";
import mysqlConnection from "../mysql.js";

const router = express.Router();

// router.get("/", async (req, res) => {
//   try {
//     mysqlConnection.query(`CALL GetAllCashierDetails();`, (error, results, fields) => {
//       if (error) {
//         return mysqlConnection.rollback(() => {
//           throw error;
//         });
//       }
//       var orders = results;
//       res.send(orders[0]);
//     });
//   } catch (err) {
//     console.log(err);
//     res.status(400).send(err.message);
//   }
// });

router.get("/get-pettycash", async (req, res) => {
  try {
    mysqlConnection.query(
      `CALL GetPettyCash();`,
      (error, results, fields) => {
        if (error) {
          mysqlConnection.rollback();
          res.status(500).send("Error while getting cashier details");
        }
        res.send(results[0][0]);
      }
    );
  } catch (err) {
    console.log(err);
    res.status(400).send(err.message);
  }
});

router.post("/", async (req, res) => {
  try {
    var amount = req.body.amount;
    var ispettycash = req.body.ispettycash;
    var createdBy = req.body.createdBy;
    mysqlConnection.beginTransaction((err) => {
      if (err) {
        mysqlConnection.rollback();
        res.status(500).send("Error while inserting petty cash details");
      }
      mysqlConnection.query(
        `CALL InsertPettyCash('${amount}','${ispettycash}','${createdBy}');`,
        (error, results, fields) => {
          if (error) {
            mysqlConnection.rollback();
            res.status(500).send("Error while inserting petty cash details");
          }
        }
      );
      mysqlConnection.commit((err) => {
        if (err) {
          mysqlConnection.rollback();
          res.status(500).send("Error while inserting petty cash details");
        }
        console.log("success!");
        res.send({ message: "Petty Cash Updated." });
      });
    });
  } catch (err) {
    console.log(err);
    res.status(400).send(err.message);
  }
});

router.post("/insert-withdrawal", async (req, res) => {
  try {
    var withdrawalAmount = req.body.WithdrawalAmount;
    var createdBy = req.body.CreatedBy;
    mysqlConnection.beginTransaction((err) => {
      if (err) {
        mysqlConnection.rollback();
        res.status(500).send("Error while inserting petty cash details");
      }
      mysqlConnection.query(
        `CALL InsertCashierWithdrawal(${withdrawalAmount},${createdBy});`,
        (error, results, fields) => {
          if (error) {
            mysqlConnection.rollback();
            res.status(500).send("Error while inserting petty cash details");
          }
        }
      );
      mysqlConnection.commit((err) => {
        if (err) {
          mysqlConnection.rollback();
          res.status(500).send("Error while inserting petty cash details");
        }
        console.log("success!");
        res.send({ message: "Petty Cash Updated." });
      });
    });
  } catch (err) {
    console.log(err);
    res.status(400).send(err.message);
  }
});

export default router;
