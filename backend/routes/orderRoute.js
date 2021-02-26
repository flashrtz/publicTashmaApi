import express from "express";
import mysqlConnection from "../mysql.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    mysqlConnection.query(`CALL GetAllOrders();`, (error, results, fields) => {
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

router.get("/:id", async (req, res) => {
  try {
    var order;
    mysqlConnection.query(
      `CALL GetOrderbyId(${req.params.id});`,
      (error, results, fields) => {
        if (error) {
          return mysqlConnection.rollback(() => {
            throw error;
          });
        }
        order = {
          OrderId: results[0][0].OrderId,
          OrderTotal: results[0][0].OrderTotal,
          PaymentMethodName: results[0][0].PaymentMethodName,
          AdvancePayment: results[0][0].AdvancePayment,
          AmountDue: results[0][0].AmountDue,
          IsDone: results[0][0].IsDone,
          IsCompleted: results[0][0].IsCompleted,
          CreatedDate: results[0][0].CreatedDate,
          CustomerId: results[0][0].CustomerId,
          CustomerName: results[0][0].CustomerName,
          PhoneNumber: results[0][0].PhoneNumber,
          CreatedBy: results[0][0].CreatedBy,
          Items: [],
        };
      }
    );
    mysqlConnection.query(
      `CALL GetOrderItemsbyId(${req.params.id});`,
      (error, results, fields) => {
        if (error) {
          return mysqlConnection.rollback(() => {
            throw error;
          });
        }
        var items = results[0].map((item, i) => {
          return {
            Id: item.Id,
            OrderId: item.OrderId,
            CategoryName: item.CategoryName,
            ProductName: item.ProductName,
            Description: item.Description,
            Qty: item.Qty,
            Price: item.Price,
            Discount: item.Discount,
            WorkDoneBy: item.WorkDoneByName,
            Commission: item.Commission,
            CreatedDate: item.CreatedDate,
            CreatedBy: item.CreatedBy,
            ModifiedDate: item.ModifiedDate,
            ModifiedBy: item.ModifiedBy,
          };
        });
        order.Items = items;
        res.send(order);
      }
    );
  } catch (err) {
    console.log(err);
    res.status(400).send(err.message);
  }
});

router.post("/get-order-by-daterange", async (req, res) => {
  try {
    mysqlConnection.query(
      `CALL GetOrderbyDateRange('${req.body.startDate}', '${req.body.endDate}');`,
      (error, results, fields) => {
        if (error) {
          return mysqlConnection.rollback(() => {
            throw error;
          });
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
    var CustomerName = req.body.CustomerName;
    var PhoneNumber = req.body.PhoneNumber;
    var User = req.body.UserId;
    mysqlConnection.beginTransaction((err) => {
      if (err) {
        throw err;
      }
      mysqlConnection.query(
        `CALL InsertCustomer('${CustomerName}', '${PhoneNumber}', ${User}, @customerId);`,
        (error, results, fields) => {
          if (error) {
            return mysqlConnection.rollback(() => {
              throw error;
            });
          }

          mysqlConnection.query(
            "Select @customerId as customerId;",
            (error, results, fields) => {
              if (error) {
                return mysqlConnection.rollback(() => {
                  throw error;
                });
              }
              var CustomerId = results[0].customerId;
              var OrderTotal = parseFloat(req.body.TotalAmount);
              var PaymentMethodId = parseFloat(req.body.PaymentMethodId);
              var AdvancePayment = parseFloat(req.body.Advance);
              var AmountDue = parseFloat(req.body.AmountDue);

              mysqlConnection.query(
                `CALL InsertOrderDetails(${CustomerId}, ${OrderTotal}, ${PaymentMethodId},${AdvancePayment}, ${AmountDue}, ${User}, @orderId);`,
                (error, results, fields) => {
                  if (error) {
                    return mysqlConnection.rollback(() => {
                      throw error;
                    });
                  }
                  mysqlConnection.query(
                    "Select @orderId as orderId;",
                    (error, results, fields) => {
                      if (error) {
                        return mysqlConnection.rollback(() => {
                          throw error;
                        });
                      }
                      var OrderId = results[0].orderId;
                      req.body.Orders.map((item) => {
                        mysqlConnection.query(
                          `CALL InsertOrderDetailsItem(${OrderId}, ${item.CategoryId}, ${item.ProductId}, '${item.Description}', ${item.Qty}, ${item.Price}, ${item.Discount}, ${item.WorkDoneBy}, ${item.Commission}, ${User});`,
                          (error, results, fields) => {
                            if (error) {
                              return mysqlConnection.rollback(() => {
                                throw error;
                              });
                            }
                          }
                        );
                      });

                      mysqlConnection.commit((err) => {
                        if (err) {
                          return mysqlConnection.rollback(() => {
                            throw err;
                          });
                        }
                        console.log("success!");
                        res.send({ message: "Order Created.", OrderId: OrderId});
                      });
                    }
                  );
                }
              );
            }
          );
        }
      );
    });
  } catch (err) {
    console.log(err);
    res.status(400).send(err.message);
  }
});

router.post("/complete", async (req, res) => {
  try {
    var OrderId = req.body.OrderId;
    // console.log(OrderId);
    mysqlConnection.beginTransaction((err) => {
      if (err) {
        throw err;
      }
      mysqlConnection.query(
        `CALL CompleteOrder(${OrderId});`,
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
        res.send({ message: "Order Completed." });
      });
    });
  } catch (err) {
    console.log(err);
    res.status(400).send(err.message);
  }
});
router.post("/work-done", async (req, res) => {
  try {
    var OrderId = req.body.OrderId;
    // console.log(OrderId);
    mysqlConnection.beginTransaction((err) => {
      if (err) {
        throw err;
      }
      mysqlConnection.query(
        `CALL WorkDoneOrder(${OrderId});`,
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
        res.send({ message: "Order Edited." });
      });
    });
  } catch (err) {
    console.log(err);
    res.status(400).send(err.message);
  }
});

router.post("/payCommission", async (req, res) => {
  try {
    var OrderId = req.body.OrderId;
    var UserId = req.body.UserId;
    // console.log(OrderId);
    mysqlConnection.beginTransaction((err) => {
      if (err) {
        throw err;
      }
      mysqlConnection.query(
        `CALL PayCommision(${OrderId},${UserId});`,
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
        res.send({ message: "Order Commission Paid." });
      });
    });
  } catch (err) {
    console.log(err);
    res.status(400).send(err.message);
  }
});

export default router;
