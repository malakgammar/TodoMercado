import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors"; 

import userRoute from "./routes/userRoute.js";
import commandeRoute from './routes/commandeRoute.js';
import messageRoute from "./routes/messageRoute.js";
import categoryRoute from "./routes/categoryRoute.js";
import productRoute from "./routes/productRoute.js";
import authRoute from './routes/authRoute.js';
import panierRoute from "./routes/panierRoute.js";

const app = express();

app.use(cors({
  origin: 'http://localhost:3000', 
}));

app.use(bodyParser.json());
dotenv.config();

const PORT = process.env.PORT || 5000;
const MONGOURL = process.env.MONGO_URL;

mongoose
  .connect(MONGOURL)
  .then(() => {
    console.log("Database connected successfully.");
    app.listen(PORT, () => {
      console.log(`Server is running on port : ${PORT}`);
    });
  })
  .catch((error) => console.log(error));

app.use("/user", userRoute);
app.use('/commande', commandeRoute);
app.use('/message', messageRoute);
app.use('/category', categoryRoute);
app.use('/product', productRoute);
app.use('/auth', authRoute);
app.use('/panier', panierRoute);