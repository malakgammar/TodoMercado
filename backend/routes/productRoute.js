import express from "express";

import {  create, fetch ,update , remove } from "../controller/productController.js";

const productRoute = express.Router();

productRoute.get("/getallproducts", fetch); 
productRoute.post("/createP", create); 
productRoute.put("/:id", update);
productRoute.delete("/:id", remove);
export default productRoute;