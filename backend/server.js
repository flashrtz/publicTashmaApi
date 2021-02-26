import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import config from "./config";
import userRoute from "./routes/userRoute";
import orderRoute from "./routes/orderRoute";
import categoryRoute from "./routes/categoryRoute";
import productRoute from "./routes/productRoute";
import paymentMethodRoute from "./routes/paymentMethodRoute";
import commissionRoute from "./routes/commissionRoute";
import salesRoute from "./routes/salesRoute";
import cashierRoute from "./routes//cashierRoute";

const app = express();
app.use(
  cors({
    origin: "http://dashboard.tashmastudio.com",
    credentials: true,
  })
);
// Add headers
// app.use(function (req, res, next) {
//   res.setHeader("Access-Control-Allow-Origin", "http://localhost:8080");


//   res.setHeader(
//     "Access-Control-Allow-Methods",
//     "GET, POST, OPTIONS, PUT, PATCH, DELETE"
//   );

//   res.setHeader(
//     "Access-Control-Allow-Headers",
//     "X-Requested-With,content-type"
//   );

//   res.setHeader("Access-Control-Allow-Credentials", true);
//   next();
// });
app.get("/", (_req, res) => res.send("Hello Tashma"));
app.use(bodyParser.json());
app.use("/api/users", userRoute);
app.use("/api/orders", orderRoute);
app.use("/api/categories", categoryRoute);
app.use("/api/products", productRoute);
app.use("/api/paymentmethods", paymentMethodRoute);
app.use("/api/commissions", commissionRoute);
app.use("/api/sales", salesRoute);
app.use("/api/cashier", cashierRoute);

app.listen(config.PORT, () => {
  console.log("Server started at http://localhost:5000");
});
