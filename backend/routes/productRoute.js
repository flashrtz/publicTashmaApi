import express from "express";
import mysqlConnection from "../mysql.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    mysqlConnection.query(`CALL GetAllProducts();`, (error, results, fields) => {
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
    var CategoryId = req.body.CategoryId;
    var Name = req.body.Name;
    var Description = req.body.Description;
    var BuyingPrice = req.body.BuyingPrice;
    var SellingPrice = req.body.SellingPrice;
    var Quantity = req.body.Quantity;
    var Commission = req.body.Commission;

    mysqlConnection.beginTransaction((err) => {
      if (err) {
        throw err;
      }
      mysqlConnection.query(
        `CALL CreateProduct(${CategoryId},'${Name}','${Description}',${BuyingPrice},${SellingPrice},${Quantity},${Commission});`,
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
        res.send({ message: "Product Created." });
      });
    });
  } catch (err) {
    console.log(err);
    res.status(400).send(err.message);
  }
});

router.put("/", async (req, res) => {
  try {
    var ProductId = req.body.ProductId;
    var CategoryId = req.body.CategoryId;
    var Name = req.body.Name;
    var Description = req.body.Description;
    var BuyingPrice = req.body.BuyingPrice;
    var SellingPrice = req.body.SellingPrice;
    var Quantity = req.body.Quantity;
    var Commission = req.body.Commission;
    mysqlConnection.beginTransaction((err) => {
      if (err) {
        throw err;
      }
      mysqlConnection.query(
        `CALL CreateProduct(${ProductId},${CategoryId},'${Name}','${Description}',${BuyingPrice},${SellingPrice},${Quantity},${Commission});`,
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
        res.send({ message: "Product Edited." });
      });
    });
  } catch (err) {
    console.log(err);
    res.status(400).send(err.message);
  }
});

router.delete("/", async (req, res) => {
  try {
    var ProductId = req.body.ProductId;
    mysqlConnection.beginTransaction((err) => {
      if (err) {
        throw err;
      }
      mysqlConnection.query(
        `CALL DeleteProduct(${ProductId});`,
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
        res.send({ message: "Product Deleted." });
      });
    });
  } catch (err) {
    console.log(err);
    res.status(400).send(err.message);
  }
});

export default router;
