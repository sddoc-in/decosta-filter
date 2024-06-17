import express from "express";
import { register } from "../controller/register";
import { login } from "../controller/login";
import { deleteSearch, getSearchBySearchId, getSearchesByUser, startSearching, stopSearch, storeSearch } from "../controller/searches";
import { getAllResultsByUser } from "../controller/results";
import { createUser, getUser } from "../controller/users";
const router = express.Router();

router.post("/api/register", register);
router.get("/api/login", login);

// searches routes
router.post("/api/searches/store", storeSearch);
router.post("/api/searches/start", startSearching);
router.post("/api/searches/stop", stopSearch);
router.post("/api/searches/get", getSearchesByUser);
router.get("/api/searches", getSearchBySearchId);
router.delete("/api/searches/delete", deleteSearch);

// results routes
router.get("/api/results/all", getAllResultsByUser);

//users routes
router.post("/api/user/create",createUser);
router.get("/api/user/:uid",getUser);


export default router;
