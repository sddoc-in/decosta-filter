import { Request, Response } from "express";
import { Db, Collection } from "mongodb";
import { validateSession } from "../functions/hash";
import { validateToken } from "../functions/bearer";
import ConnectionRes from "../interface/ConnectionRes";
import connectToCluster from "../connection/connect";
import RolesEnum from "../config/Roles";


export async function updateSettings(req: Request, res: Response) {
    try {
        let { DailySearches, DailyResults, SearchPerUser, ResultsPerSearch, uid, access_token, session } = req.body;

        if (DailySearches === undefined || DailyResults === undefined || SearchPerUser === undefined || ResultsPerSearch === undefined) {
            return res.status(400).json({ message: "Invalid data" });
        }

        if (DailySearches < 0 || DailyResults < 0 || SearchPerUser < 0 || ResultsPerSearch < 0) {
            return res.status(400).json({ message: "Invalid data" });
        }

        if (uid === undefined || access_token === undefined || session === undefined) {
            return res.status(400).json({ message: "Invalid data" });
        }


        // check session
        let sessionBool = validateSession(session);
        if (sessionBool) {
            return res.status(400).json({ message: "Invalid session" });
        }

        let tokenErr = validateToken(access_token);
        if (tokenErr !== "") {
            return res.status(400).json({ message: tokenErr });
        }

        // create connection
        const connect: ConnectionRes = await connectToCluster();
        if (typeof connect.conn === "string") {
            return res.status(500).json(connect);
        }

        const conn = connect.conn;
        const db: Db = conn.db("Master");
        const usercollection: Collection = db.collection("users");
        const admincollection: Collection = db.collection("admin");

        // check user exists and is admin
        let user = await usercollection.findOne({ uid: uid, role: RolesEnum.ADMIN });
        if (!user) {
            return res.status(400).json({ message: "Invalid user" });
        }

        // insert or update admin settings and it will be only on erecord in the collection
        let settings = await admincollection.findOne({});
        if (!settings) {
            await admincollection.insertOne({
                DailySearches,
                DailyResults,
                SearchPerUser,
                ResultsPerSearch,
            });
        } else {
            await admincollection.updateOne({}, {
                $set: {
                    DailySearches,
                    DailyResults,
                    SearchPerUser,
                    ResultsPerSearch,
                }
            });
        }

        res.json({ message: "Settings updated successfully" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal server error" });
    }

}

export async function getSettings(req: Request, res: Response) {
    let { uid, access_token, session } = req.query;
    try {

        if (uid === undefined || access_token === undefined || session === undefined) {
            return res.status(400).json({ message: "Invalid data" });
        }


        // check session
        let sessionBool = validateSession(session as string);
        if (sessionBool) {
            return res.status(400).json({ message: "Invalid session" });
        }

        let tokenErr = validateToken(access_token as string);
        if (tokenErr !== "") {
            return res.status(400).json({ message: tokenErr });
        }

        // create connection
        const connect: ConnectionRes = await connectToCluster();
        if (typeof connect.conn === "string") {
            return res.status(500).json(connect);
        }

        const conn = connect.conn;
        const db: Db = conn.db("Master");
        const admincollection: Collection = db.collection("admin");

        let settings = await admincollection.findOne({});
        if (!settings) {
            return res.status(400).json({ message: "Settings not found" });
        }

        res.json({
            status: 200,
            data: settings
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal server error" });
    }
}