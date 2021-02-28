import express from "express";
import mysqlConnection from "../mysql.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    mysqlConnection.query(
      `CALL GetAllProducts();`,
      (error, results, fields) => {
        if (error) {
          mysqlConnection.rollback();
          res.status(500).send("Error while getting all products");
        }
        var orders = results;
        res.send(orders[0]);
      }
    );
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
        mysqlConnection.rollback();
        res.status(500).send("Error while creating product");
      }
      mysqlConnection.query(
        `CALL CreateProduct(${CategoryId},'${Name}','${Description}',${BuyingPrice},${SellingPrice},${Quantity},${Commission});`,
        (error, results, fields) => {
          if (error) {
            mysqlConnection.rollback();
            res.status(500).send("Error while creating product");
          }
        }
      );
      mysqlConnection.commit((err) => {
        if (err) {
          mysqlConnection.rollback();
          res.status(500).send("Error while creating product");
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
        mysqlConnection.rollback();
        res.status(500).send("Error while editing product");
      }
      mysqlConnection.query(
        `CALL CreateProduct(${ProductId},${CategoryId},'${Name}','${Description}',${BuyingPrice},${SellingPrice},${Quantity},${Commission});`,
        (error, results, fields) => {
          if (error) {
            mysqlConnection.rollback();
            res.status(500).send("Error while editing product");
          }
        }
      );
      mysqlConnection.commit((err) => {
        if (err) {
          mysqlConnection.rollback();
          res.status(500).send("Error while editing product");
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
        mysqlConnection.rollback();
        res.status(500).send("Error while deleting product");
      }
      mysqlConnection.query(
        `CALL DeleteProduct(${ProductId});`,
        (error, results, fields) => {
          if (error) {
            mysqlConnection.rollback();
            res.status(500).send("Error while deleting product");
          }
        }
      );
      mysqlConnection.commit((err) => {
        if (err) {
          mysqlConnection.rollback();
          res.status(500).send("Error while deleting product");
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
