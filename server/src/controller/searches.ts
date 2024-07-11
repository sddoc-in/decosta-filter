import { Request, Response } from 'express';
import ConnectionRes from '../interface/ConnectionRes';
import connectToCluster from '../connection/connect';
import { Db, Collection } from 'mongodb';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { closeConn } from '../connection/closeConn';
import SearchStatus from '../config/SearchStatus';
import RolesEnum from '../config/Roles';


export async function storeSearch(req: Request, res: Response) {

    const { name, country, content_languages, filtterStart_date, filtterEnd_date, querry, ad_status_type, reach, ad_type, media_type, publisher_platforms, Nextforward_cursor, Nextbackward_cursor, Nextcollation_token, uid, access_token, session, page } = req.body;

    try {
        if (name === undefined) {
            return res.status(400).json({ message: "Name required" });
        }
        if (country === undefined || country === "") {
            return res.status(400).json({ message: "Country required" });
        }
        if (content_languages === undefined || content_languages.length === 0) {
            return res.status(400).json({ message: "Content languages required" });
        }
        if (filtterStart_date === undefined) {
            return res.status(400).json({ message: "Start date required" });
        }
        if (filtterEnd_date === undefined) {
            return res.status(400).json({ message: "End date required" });
        }
        if (querry === undefined) {
            return res.status(400).json({ message: "Querry required" });
        }
        if (ad_status_type === undefined) {
            return res.status(400).json({ message: "Ad status type required" });
        }
        if (reach === undefined) {
            return res.status(400).json({ message: "Reach required" });
        }
        if (ad_type === undefined) {
            return res.status(400).json({ message: "Ad type required" });
        }
        if (media_type === undefined) {
            return res.status(400).json({ message: "Media type required" });
        }
        if (publisher_platforms === undefined) {
            return res.status(400).json({ message: "Publisher platforms required" });
        }
        if (Nextforward_cursor === undefined) {
            return res.status(400).json({ message: "Nextforward cursor required" });
        }
        if (Nextbackward_cursor === undefined) {
            return res.status(400).json({ message: "Nextbackward cursor required" });
        }
        if (Nextcollation_token === undefined) {
            return res.status(400).json({ message: "Nextcollation token required" });
        }
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
        const admin: Collection = db.collection("users");

        // check user if admin or not
        let user = await admin.findOne({ uid: uid, role: RolesEnum.ADMIN });
        if (!user) {
            let adminSettings = await admin.findOne({});

            let totalSearches = await search.find({ uid: uid }, { projection: { _id: 0, searchId: 1 } }).toArray();
            if (totalSearches.length > adminSettings!.SearchPerUser) {
                return res.status(400).json({ message: "You have reached the maximum number of searches" });
            }

            let today = new Date().toLocaleDateString();
            totalSearches = await search.find({ CreatedDate: today }, { projection: { _id: 0, searchId: 1 } }).toArray();
            if (totalSearches.length > adminSettings!.DailySearches) {
                return res.status(400).json({ message: "You have reached the maximum number of searches for today" });
            }
        }

        let searchId = uuidv4()

        await search.insertOne({
            searchId: searchId,
            uid: uid,
            country: country,
            content_languages: content_languages,
            filtterStart_date: new Date(filtterStart_date),
            filtterEnd_date: new Date(filtterEnd_date),
            querry: querry,
            ad_status_type: parseInt(ad_status_type),
            reach: reach,
            ad_type: ad_type,
            media_type: media_type,
            publisher_platforms: publisher_platforms,
            Nextforward_cursor: Nextforward_cursor,
            Nextbackward_cursor: Nextbackward_cursor,
            Nextcollation_token: Nextcollation_token,
            page: page,
            currentStatus: SearchStatus.Created,
            name: name,
            CreatedDate: new Date().toLocaleDateString()
        });

        return res.status(200).json({ message: "Search stored successfully", searchId: searchId });
    }
    catch (err) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

export async function deleteSearch(req: Request, res: Response) {
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
        if (searchId === undefined) {
            return res.status(400).json({ message: "Search id required" });
        }

        // create connection
        const connect: ConnectionRes = await connectToCluster();
        if (typeof connect.conn === "string") {
            return res.status(500).json(connect);
        }

        const conn = connect.conn;
        const db: Db = conn.db("Master");
        const search: Collection = db.collection("search");
        const result: Collection = db.collection("results");

        search.deleteOne({ searchId: searchId });
        result.deleteMany({ SearchUid: searchId });

        return res.status(200).json({ message: "Search deleted successfully" });
    }
    catch (err) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

export async function getSearchesByUser(req: Request, res: Response) {
    const { uid, access_token, session, status } = req.body;

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
        if (status === undefined) {
            return res.status(400).json({ message: "Status required" });
        }

        // create connection
        const connect: ConnectionRes = await connectToCluster();
        if (typeof connect.conn === "string") {
            return res.status(500).json(connect);
        }

        const conn = connect.conn;
        const db: Db = conn.db("Master");
        const search: Collection = db.collection("search");

        let searches;
        let projections = {
            _id: 0,
            "name": 1,
            "searchId": 1,
            "country": 1,
            "content_languages": 1,
            "filtterStart_date": 1,
            "filtterEnd_date": 1,
            "querry": 1,
            "status": 1,
            "CreatedDate": 1,
            "currentStatus": 1
        }

        if (Array.isArray(status)) {

            searches = await search.find({
                uid: uid,
                currentStatus: {
                    $in: status
                }
            }, {
                projection: projections
            }).toArray();
        }
        else {
            searches = await search.find({
                uid: uid,
                currentStatus: status
            }, {
                projection: projections
            }).toArray();
        }
        closeConn(conn);

        return res.status(200).json({ searches: searches, message: "Searches fetched successfully" });
    }
    catch (err) {
        return res.status(500).json({ message: "Internal server error" });
    }

}

export async function startSearching(req: Request, res: Response) {
    const { uid, access_token, session, searchId } = req.body;

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

        await search.updateOne({ searchId: searchId }, { $set: { currentStatus: SearchStatus.InProgress } });


        axios.get("https://facebookads.onrender.com/ads?SearchID=" + searchId)
            .then((response) => {
                console.log(response.data);
            })
            .catch((error) => {
                console.log(error);
            });

        return res.status(200).json({ message: "Search started successfully" });

        closeConn(conn);


    }
    catch (err) {
        return res.status(500).json({ message: "Something went Wrong" });
    }

}

export async function stopSearch(req: Request, res: Response) {
    const { uid, access_token, session, searchId } = req.body;

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

        await search.updateOne({ searchId: searchId }, { $set: { currentStatus: SearchStatus.Stopped } });
        closeConn(conn);

        return res.status(200).json({ message: "Search stopped successfully" });

    }
    catch (err) {
        return res.status(500).json({ message: "Something went Wrong" });
    }

}

export async function getSearchBySearchId(req: Request, res: Response) {
    const { searchId } = req.query;

    try {
        if (!searchId) {
            return res.status(400).json({ message: "Search id required" });
        }

        // create connection
        const connect: ConnectionRes = await connectToCluster();
        if (typeof connect.conn === "string") {
            return res.status(500).json(connect);
        }

        const conn = connect.conn;
        const db: Db = conn.db("Master");
        const search: Collection = db.collection("search");

        const searchResult = await search.findOne({ searchId: searchId as string }, {
            projection: {
                _id: 0,
                searchId: 1,
                uid: 1,
                country: 1,
                content_languages: 1,
                filtterStart_date: 1,
                filtterEnd_date: 1,
                querry: 1,
                ad_status_type: 1,
                reach: 1,
                ad_type: 1,
                media_type: 1,
                publisher_platforms: 1,
                Nextforward_cursor: 1,
                Nextbackward_cursor: 1,
                Nextcollation_token: 1,
                page: 1,
                currentStatus: 1
            }
        });

        if (searchResult) {
            // Modify the response to include all values of the arrays
            const { publisher_platforms, media_type, content_languages, ...rest } = searchResult;
            const response = {
                ...rest,
                publisher_platforms: publisher_platforms ? Array.isArray(publisher_platforms) ? publisher_platforms : [publisher_platforms] : [],
                media_type: media_type ? Array.isArray(media_type) ? media_type : [media_type] : [],
                content_languages: content_languages ? Array.isArray(content_languages) ? content_languages : [content_languages] : []
            };
            closeConn(conn);

            return res.status(200).json({ search: response, message: "Search fetched successfully" });
        } else {
            return res.status(404).json({ message: "Search not found" });
        }
    } catch (err: any) {
        return res.status(500).json({ message: "Internal server error", error: err.message });
    }
}
