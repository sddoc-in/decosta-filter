import { Request, Response } from 'express';
import ConnectionRes from '../interface/ConnectionRes';
import connectToCluster from '../connection/connect';
import { Db, Collection } from 'mongodb';



export async function getAllResultsByUser(req: Request, res: Response) {

    const { uid, access_token, session, searchId } = req.query;

    try {
        if (uid === undefined) {
            return res.status(400).json({ message: "User id required" });
        }
        if (access_token === undefined) {
            return res.status(400).json({ message: "Access token required" });
        }
        if (session === undefined) {
            return res.status(400).json({ message: "Session required" });
        }

        // create connection
        const connect: ConnectionRes = await connectToCluster();
        if (typeof connect.conn === "string") {
            return res.status(500).json(connect);
        }

        const conn = connect.conn;
        const db: Db = conn.db("Master");
        const search: Collection = db.collection("search");
        const results: Collection = db.collection("results");

        let searches;
        // aggregate search results with search collection
        if (searchId === undefined) {
            searches = await search.aggregate([
                {
                    $lookup: {
                        from: "results",
                        localField: "searchId",
                        foreignField: "SearchUid",
                        as: "results"
                    }
                },
                {
                    $match: {
                        uid: uid
                    }
                },
                {
                    $unwind: "$results"
                },
                {
                    $sort: { "results.created_at": -1 }
                },
                {
                    $project: {
                        _id: 0,
                        "results": 1,
                    }

                }
            ]).toArray();
        }
        else {
            searches = await search.aggregate([
                {
                    $lookup: {
                        from: "results",
                        localField: "searchId",
                        foreignField: "SearchUid",
                        as: "results"
                    }
                },
                {
                    $match: {
                        uid: uid,
                        searchId: searchId
                    }
                },
                {
                    $unwind: "$results"
                },
                {
                    $sort: { "results.created_at": -1 }
                },
                {
                    $project: {
                        _id: 0,
                        "results": 1,
                    }

                }
            ]).toArray();
        }


        return res.status(200).json({ results: searches });
    }
    catch (err) {
        return res.status(500).json({ message: "Internal server error" });
    }

}

