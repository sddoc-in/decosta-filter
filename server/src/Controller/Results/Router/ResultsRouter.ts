import express from "express";
import Get from "../API/Get";
import Create from "../API/Create";
import Delete from "../API/Delete";

const ResultRouter = express.Router();

ResultRouter.get("/",new Get().getBySearchId);
ResultRouter.post("/create",new Create().create);
ResultRouter.delete("/delete",new Delete().delete);

export default ResultRouter;
