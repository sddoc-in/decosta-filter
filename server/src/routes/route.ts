import express from "express";


import UserRouter from "../Controller/User/Route/UserRouter";
import NotificationRoute from "../Controller/Notifications/Route/NotificationRoute";


const MainRouter = express.Router();

MainRouter.use("/api/user/", UserRouter);
MainRouter.use("/api/notifications/", NotificationRoute);


export default MainRouter;
