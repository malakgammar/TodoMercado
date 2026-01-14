import express from "express";

import { create, deleteUser, fetch, update, fetchUserProfile } from "../controller/userController.js";
import authenticate from "../middleware/auth.js";

const userRoute = express.Router();

userRoute.get("/getallusers", fetch); 
userRoute.post ("/createU", create); 
userRoute.put("/updateU/:id", update); 
userRoute.delete("/deleteU/:id", deleteUser);
userRoute.get("/profile", authenticate, fetchUserProfile);

export default userRoute;