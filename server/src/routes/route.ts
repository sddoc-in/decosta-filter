import express from "express";
import { register, registerAdmin } from "../controller/register";
import { login } from "../controller/login";
import { deleteSearch, getSearchBySearchId, getSearchesByUser, startSearching, stopSearch, storeSearch } from "../controller/searches";
import { getAllResultsByUser } from "../controller/results";
import { deleteUser, getAllAdmins, getAllUsers, getUser, updateUser } from "../controller/users";
import { getNumberOfResultsOnDailyBasis, getNumberOfSearchesPerUser, getSearchCountOnDailyBasis } from "../controller/getGraphs";
import { getSettings, updateSettings } from "../controller/admin";
const router = express.Router();

router.post("/api/register", register);
// router.post("/api/admin", registerAdmin);
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

// user routes
router.get("/api/users/all", getAllUsers);
router.get("/api/users/", getUser);
router.get("/api/users/admins", getAllAdmins);
router.put("/api/users/update", updateUser);
router.delete("/api/users/delete", deleteUser);
router.post("/api/users/create", register);

// analytics
router.get("/api/analytics/search/daily",getSearchCountOnDailyBasis)
router.get("/api/analytics/results/daily",getNumberOfResultsOnDailyBasis)
router.get("/api/analytics/user/searches",getNumberOfSearchesPerUser)

// admin settings
router.put("/api/admin/settings",updateSettings)
router.get("/api/admin/settings",getSettings)


export default router;
