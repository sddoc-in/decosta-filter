import express from "express";
import Create from "../API/Create";
import Delete from "../API/Delete";
import Get from "../API/Get";
import Action from "../API/Action";


const NotificationRoute = express.Router();

NotificationRoute.post("/create",new Create().create);
NotificationRoute.delete("/delete",new Delete().delete);
NotificationRoute.get("/",new Get().getOne);
NotificationRoute.get("/all",new Get().getAll);
NotificationRoute.get("/generatedBy",new Get().getAllGeneratedBy);
NotificationRoute.get("/generatedFor",new Get().getAllGeneratedFor);
NotificationRoute.get("/show",new Get().getAllToShow);
NotificationRoute.post("/action",new Action().send);



export default NotificationRoute;
