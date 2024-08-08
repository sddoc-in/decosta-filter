import express from "express";


import UserRouter from "../Controller/User/Route/UserRouter";
import NotificationRoute from "../Controller/Notifications/Route/NotificationRoute";
import SearchRoute from "../Controller/Search/Router/SearchRouter";
import ResultRouter from "../Controller/Results/Router/ResultsRouter";
import SequenceRouter from "../Controller/Sequence/Router/SequenceRouter";


const MainRouter = express.Router();

MainRouter.use("/api/user/", UserRouter);
MainRouter.use("/api/notifications/", NotificationRoute);
MainRouter.use("/api/search/", SearchRoute);
MainRouter.use("/api/result/", ResultRouter);
MainRouter.use("/api/sequence/", SequenceRouter);


export default MainRouter;
