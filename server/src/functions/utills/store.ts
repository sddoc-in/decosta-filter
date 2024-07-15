import { Collection, Db } from "mongodb"
import connectToCluster from "../../connection/connect"
import ConnectionRes from "../../interface/ConnectionRes"
import RolesEnum from "../../config/Roles"
import { v4 as uuidv4 } from 'uuid';
import SearchStatus from "../../config/SearchStatus";


async function store(data: any) {
    try {
        if (data.name === undefined) {
            return "Name required"
        }
        if (data.country === undefined || data.country === "") {
            return "Country required"
        }
        if (data.content_languages === undefined || data.content_languages.length === 0) {
            return "Content languages required"
        }
        if (data.filtterStart_date === undefined) {
            return "Start date required"
        }
        if (data.filtterEnd_date === undefined) {
            return "End date required"
        }
        if (data.querry === undefined) {
            return "Querry required"
        }
        if (data.ad_status_type === undefined) {
            return "Ad status type required"
        }
        if (data.reach === undefined) {
            return "Reach required"
        }
        if (data.ad_type === undefined) {
            return "Ad type required"
        }
        if (data.media_type === undefined) {
            return "Media type required"
        }
        if (data.publisher_platforms === undefined) {
            return "Publisher platforms required"
        }
        if (data.uid === undefined) {
            return "User id required"
        }
        if (data.access_token === undefined) {
            return "Access token required"
        }
        if (data.session === undefined) {
            return "Session required"
        }

        // create connection
        const connect: ConnectionRes = await connectToCluster();
        if (typeof connect.conn === "string") {
            return connect.conn;
        }

        const conn = connect.conn;
        const db: Db = conn.db("Master");
        const search: Collection = db.collection("search");
        const admin: Collection = db.collection("users");

        // check user if admin or not
        let user = await admin.findOne({ uid: data.uid, role: RolesEnum.ADMIN });
        if (!user) {
            let adminSettings = await admin.findOne({});

            let totalSearches = await search.find({ uid: data.uid }, { projection: { _id: 0, searchId: 1 } }).toArray();
            if (totalSearches.length > adminSettings!.SearchPerUser) {
                return "You have reached the maximum number of searches"
            }

            let today = new Date().toLocaleDateString();
            totalSearches = await search.find({ CreatedDate: today }, { projection: { _id: 0, searchId: 1 } }).toArray();
            if (totalSearches.length > adminSettings!.DailySearches) {
                return "You have reached the maximum number of searches for today"
            }
        }

        let searchId = uuidv4()

        await search.insertOne({
            searchId: searchId,
            uid: data.uid,
            country: data.country,
            content_languages: data.content_languages,
            filtterStart_date: new Date(data.filtterStart_date),
            filtterEnd_date: new Date(data.filtterEnd_date),
            querry: data.querry,
            ad_status_type: parseInt(data.ad_status_type),
            reach: data.reach,
            ad_type: data.ad_type,
            media_type: data.media_type,
            publisher_platforms: data.publisher_platforms,
            Nextforward_cursor: data.Nextforward_cursor,
            Nextbackward_cursor: data.Nextbackward_cursor,
            Nextcollation_token: data.Nextcollation_token,
            page: data.page,
            currentStatus: SearchStatus.Created,
            name: data.name,
            CreatedDate: new Date().toLocaleDateString()
        });

        return { searchId: searchId }
    } catch (err) {
        console.log(err)
        return "Internal server error"
    }

}


export default store;