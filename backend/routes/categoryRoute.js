import express from "express";

import {  fetch, create, remove} from "../controller/categoryController.js";

const categoryRoute = express.Router();

categoryRoute.get("/getallcategories", fetch); 
categoryRoute.post("/createCa", create); 
categoryRoute.delete("/:id", remove);
export default categoryRoute;
