
import express from "express";
import Operations from "../API/Operations";
import Delete from "../API/Delete";
import Get from "../API/Get";

const SearchRoute = express.Router();

SearchRoute.post("/create",new Operations().create);
SearchRoute.put("/start",new Operations().start);
SearchRoute.delete("/delete",new Delete().delete);
SearchRoute.get("/getByUser",new Get().getByUser);
SearchRoute.get("/getByStatus",new Get().getByStatus);





export default SearchRoute;
