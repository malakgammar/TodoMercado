import express from "express";

import { create, fetch  } from "../controller/messageController.js";

const messageRoute = express.Router();

messageRoute.get("/getallmessages", fetch); 
messageRoute.post ("/createM", create); 

export default messageRoute;